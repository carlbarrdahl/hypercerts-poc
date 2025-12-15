import {
	Abi,
	Address,
	BaseError,
	ContractFunctionRevertedError,
	createPublicClient,
	getAddress,
	getContract,
	GetContractReturnType,
	http,
	parseEventLogs,
	PublicClient,
	WalletClient,
	Chain,
	Hex,
} from 'viem';
import { AlchemySmartAccountClient } from '@account-kit/infra';
import deployments from './deployments.json';
import { waitForTransactionReceipt } from 'viem/actions';
import { Attestation, createIndexer, VaultPage } from './lib/indexer';
import { VaultsVariables } from './lib/indexer';
import { config } from './config';
import {
	MultiOwnerLightAccount,
	MultiOwnerLightAccountClientActions,
} from '@account-kit/smart-contracts';
// import { MultiOwnerLightAccount } from '@account-kit/infra';
import { WalletClientSigner } from '@aa-sdk/core';
import { AttestationInput, createAttestation } from './lib/eas';
import { AttestationQuery, queryAttestations } from './lib/graphql';

export { HypercertsProvider, useHypercerts } from './components/provider';
export * from './hooks';
export * from './lib/indexer';

// Explicitly re-export hierarchy helper functions
export {
	getVaultChildren,
	getVaultLevel,
	calculateVaultLevel,
	getVaultLevelLabel,
} from './lib/indexer';

const HYPERCERTS_URL = 'http://localhost:3000';
const ALCHEMY_API_KEY = 'h5dpLw_3pU__4eS0W4WeF';

const { HyperVaultFactory, HyperVault } = deployments[31337];

type HyperVault = (typeof deployments)[31337]['HyperVault'];
export type HyperVaultConfig = {
	owner: Address;
	parent?: Address;
	asset: Address;
	percent: bigint;
	shares: bigint;
	metadata: Record<string, any>;
	// metadata: string;
};

// Hierarchy types for pillar => sub-pillar => pathway structure
export enum VaultLevel {
	PILLAR = 0,
	SUB_PILLAR = 1,
	PATHWAY = 2,
}

export type VaultHierarchy = {
	address: Address;
	level: VaultLevel;
	parent?: Address;
	children: Address[];
	metadata: Record<string, any>;
};

export type VaultTreeNode = {
	vault: Address;
	level: VaultLevel;
	children: VaultTreeNode[];
};

export type AccountMethods = {
	get: () => Promise<
		AlchemySmartAccountClient<
			Chain | undefined,
			MultiOwnerLightAccount<WalletClientSigner>,
			MultiOwnerLightAccountClientActions<WalletClientSigner>
		>
	>;
	updateOwners: (params: {
		ownersToAdd: Address[];
		ownersToRemove: Address[];
	}) => Promise<Hex>;
};
export type VaultMethods = {
	create: (config: HyperVaultConfig) => Promise<Address>;
	update: (id: Address, config: HyperVaultConfig) => Promise<any>;
	deposit: (id: Address, amount: bigint, receiver?: Address) => Promise<any>;
	withdraw: (id: Address, amount: bigint, receiver?: Address) => Promise<any>;
	fund: (
		id: Address,
		amount: bigint,
		pushUpstream?: boolean,
		receiver?: Address,
	) => Promise<any>;
	payout: (id: Address, amount: bigint, recipient: Address) => Promise<any>;
	mintShares: (id: Address, recipient: Address, shares: bigint) => Promise<any>;
	depositToVault: (
		fromVaultId: Address,
		toVaultId: Address,
		amount: bigint,
	) => Promise<any>;
	balance: (
		id: Address,
	) => Promise<{ assets: bigint; shares: bigint; price: bigint }>;
	query: (variables: VaultsVariables) => Promise<VaultPage | null>;
	getParent: (id: Address) => Promise<Address | null>;
	getChildVaults: (id: Address) => Promise<Address[]>;
	getTreeLevel: (id: Address) => Promise<number>;
	getTotalUpstreamSent: (id: Address) => Promise<bigint>;
	isChildVault: (id: Address, child: Address) => Promise<boolean>;
	getHierarchy: (id: Address) => Promise<VaultHierarchy>;
	getFullTree: (rootId: Address) => Promise<VaultTreeNode>;
	previewDeposit: (id: Address, assets: bigint) => Promise<bigint>;
};

export type CertMethods = {
	create: (data: AttestationInput) => Promise<Address>;
	query: (query: AttestationQuery) => Promise<Attestation[] | null>;
};

export class HypercertsSDK {
	#client: WalletClient;
	#publicClient: PublicClient;
	#abi = {
		HyperVaultFactory: HyperVaultFactory.abi as unknown as Abi,
		HyperVault: HyperVault.abi as unknown as Abi,
	};
	#factory: GetContractReturnType<typeof HyperVaultFactory.abi, WalletClient>;
	#vault: (
		address: Address,
	) => GetContractReturnType<typeof HyperVault.abi, WalletClient>;
	indexer: ReturnType<typeof createIndexer>;
	// account: AccountMethods;
	vault: VaultMethods;
	cert: CertMethods;
	test?: { token: Address };
	constructor(wallet?: WalletClient) {
		const chain = wallet?.chain;
		console.log('wallet', wallet);
		if (!wallet || !chain?.id) throw new Error('Chain ID not found');
		if (!Object.keys(config).includes(String(chain.id)))
			throw new Error('Chain not supported');

		this.#client = wallet;
		this.#publicClient = createPublicClient({ chain, transport: http() });

		this.indexer = createIndexer(chain.id as keyof typeof config);

		const client = {
			public: this.#publicClient,
			wallet,
		};

		const { HyperVaultFactory, TestToken } = deployments['31337'];
		// deployments[chain.id as unknown as '31337'];

		this.#factory = getContract({
			address: getAddress(HyperVaultFactory.address),
			abi: HyperVaultFactory.abi,
			client,
		});
		this.#vault = (address: Address) =>
			getContract({ address, abi: HyperVault.abi, client });

		this.test = {
			token: TestToken.address as Address,
		};

		this.cert = {
			create: async (data: AttestationInput) => {
				return createAttestation(data, this.#client);
			},
			query: async (query: AttestationQuery) => {
				return queryAttestations(query);
			},
		};
		this.vault = {
			create: async (config): Promise<Address> => {
				// Upload metadata to IPFS API
				const metadataBlob = new Blob([JSON.stringify(config.metadata)], {
					type: 'application/json',
				});
				const formData = new FormData();
				formData.append('file', metadataBlob, 'metadata.json');

				const response = await fetch('http://localhost:3000/api/ipfs', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`Failed to upload metadata: ${response.statusText}`);
				}

				const { cid } = await response.json();
				const metadataURI = cid;

				return this.#simulateWriteAndFindEvent({
					contract: this.#factory,
					functionName: 'create',
					args: [{ ...config, metadataURI }],
					abi: this.#abi.HyperVaultFactory,
					eventName: 'Created',
				}).then((r) => r.id);
			},
			update: async (id: Address, config) => {
				const contract = this.#vault(getAddress(id));
				return this.#simulateWriteAndFindEvent({
					contract,
					functionName: 'update',
					args: [config],
					abi: this.#abi.HyperVault,
					eventName: 'Updated',
				});
			},
			deposit: async (
				id,
				amount,
				receiver = this.#client.account?.address as Address,
			) => {
				const contract = this.#vault(getAddress(id));

				return this.#simulateWriteAndFindEvent({
					contract,
					functionName: 'deposit',
					args: [amount, receiver],
					abi: this.#abi.HyperVault,
					eventName: 'Deposit',
				});
			},
			withdraw: async (
				id,
				amount,
				receiver = this.#client.account?.address as Address,
			) => {
				const contract = this.#vault(getAddress(id));
				return this.#simulateWriteAndFindEvent({
					contract,
					functionName: 'withdraw',
					args: [amount, receiver, receiver],
					abi: this.#abi.HyperVault,
					eventName: 'Withdraw',
				});
			},
			fund: async (
				id,
				amount,
				pushUpstream = true,
				receiver: Address = this.#client.account?.address as Address,
			) => {
				const contract = this.#vault(getAddress(id));
				return this.#simulateWriteAndFindEvent({
					contract,
					functionName: 'fund',
					args: [amount, receiver],
					abi: this.#abi.HyperVault,
					eventName: 'Funded',
				});
			},
			payout: async (id, amount, recipient) => {
				const contract = this.#vault(getAddress(id));
				return this.#simulateWriteAndFindEvent({
					contract,
					functionName: 'payout',
					args: [amount, recipient],
					abi: this.#abi.HyperVault,
					eventName: 'Payout',
				});
			},
			mintShares: async (id, recipient, shares) => {
				const contract = this.#vault(getAddress(id));
				return this.#simulateWriteAndFindEvent({
					contract,
					functionName: 'mintShares',
					args: [recipient, shares],
					abi: this.#abi.HyperVault,
					eventName: 'SharesMinted',
				});
			},
			depositToVault: async (fromVaultId, toVaultId, amount) => {
				const contract = this.#vault(getAddress(fromVaultId));
				return this.#simulateWriteAndFindEvent({
					contract,
					functionName: 'depositToVault',
					args: [toVaultId, amount],
					abi: this.#abi.HyperVault,
					eventName: 'DepositedToVault',
				});
			},
			balance: async (id) => {
				const assets = await this.#vault(getAddress(id))
					.read.totalAssets()
					.then((a) => a as bigint);
				const shares = await this.#vault(getAddress(id))
					.read.totalSupply()
					.then((s) => s as bigint);

				// Calculate price with decimal precision
				// Price = assets/shares, but we need to preserve decimals
				// Since both are 18 decimals, their ratio should also be expressed in 18 decimals
				const DECIMALS = 10n ** 18n;
				const price = shares > 0n ? (assets * DECIMALS) / shares : DECIMALS;

				return { assets, shares, price } as {
					assets: bigint;
					shares: bigint;
					price: bigint;
				};
			},
			// shares: async (id: Address): Promise<bigint | undefined> =>
			// 	this.#vault(getAddress(id)).read.convertToShares([
			// 		await this.vault.balance(id),
			// 	]) as Promise<bigint | undefined>,
			query: async (variables: VaultsVariables) =>
				this.indexer.vault.query(variables),
			getParent: async (id: Address): Promise<Address | null> => {
				const parentAddr = await this.#vault(getAddress(id))
					.read.getParent()
					.then((addr) => addr as Address);
				return parentAddr === '0x0000000000000000000000000000000000000000'
					? null
					: parentAddr;
			},
			getChildVaults: async (id: Address): Promise<Address[]> => {
				return this.#vault(getAddress(id))
					.read.getChildVaults()
					.then((vaults) => vaults as Address[]);
			},
			getTreeLevel: async (id: Address): Promise<number> => {
				return this.#vault(getAddress(id))
					.read.getTreeLevel()
					.then((level) => Number(level));
			},
			getTotalUpstreamSent: async (id: Address): Promise<bigint> => {
				return this.#vault(getAddress(id))
					.read.totalUpstreamSent()
					.then((amount) => amount as bigint);
			},
			isChildVault: async (id: Address, child: Address): Promise<boolean> => {
				return this.#vault(getAddress(id))
					.read.isChildVault([child])
					.then((isChild) => isChild as boolean);
			},
			getHierarchy: async (id: Address): Promise<VaultHierarchy> => {
				const vault = this.#vault(getAddress(id));
				const [level, children, config] = await Promise.all([
					vault.read.getTreeLevel().then((l) => Number(l)),
					vault.read.getChildVaults().then((c) => c as Address[]),
					vault.read.config(),
				]);

				const hierarchy: VaultHierarchy = {
					address: getAddress(id),
					level: level as VaultLevel,
					children,
					metadata: {}, // Would need to fetch from IPFS using metadataURI from config
				};

				// @ts-ignore - config structure
				if (
					config.parent &&
					config.parent !== '0x0000000000000000000000000000000000000000'
				) {
					// @ts-ignore
					hierarchy.parent = config.parent as Address;
				}

				return hierarchy;
			},
			getFullTree: async (rootId: Address): Promise<VaultTreeNode> => {
				const buildTree = async (vaultId: Address): Promise<VaultTreeNode> => {
					const [level, children] = await Promise.all([
						this.vault.getTreeLevel(vaultId),
						this.vault.getChildVaults(vaultId),
					]);

					const childNodes = await Promise.all(
						children.map((child) => buildTree(child)),
					);

					return {
						vault: vaultId,
						level: level as VaultLevel,
						children: childNodes,
					};
				};

				return buildTree(rootId);
			},
			previewDeposit: async (id: Address, assets: bigint): Promise<bigint> => {
				return this.#vault(getAddress(id))
					.read.previewDeposit([assets])
					.then((shares) => shares as bigint);
			},
		};
	}

	async #simulateWriteAndFindEvent<T = any>({
		contract,
		functionName,
		args,
		abi,
		eventName,
	}: {
		contract: any;
		functionName: string;
		args?: any[];
		abi: Abi;
		eventName: string;
	}): Promise<T> {
		try {
			const hash = await (contract.write as any)[functionName]({
				functionName,
				args,
				account: this.#client.account,
			});
			// Send the transaction with the HyperAccount
			// const receipt = await waitForTransactionReceipt(await this.account.get(), {

			const receipt = await waitForTransactionReceipt(this.#client, {
				hash,
			});
			const logs = parseEventLogs({ abi, logs: receipt.logs });
			const event: any = logs.find((log: any) => log.eventName === eventName);

			if (!event) {
				throw new Error(`Event ${eventName} not found in transaction logs`);
			}

			return event.args as T;
		} catch (err: any) {
			if (err instanceof BaseError) {
				const revertError = err.walk(
					(err) => err instanceof ContractFunctionRevertedError,
				);
				if (revertError instanceof ContractFunctionRevertedError) {
					const errorName = revertError.data?.errorName ?? '';
					throw new Error(errorName);
				}
			}
			throw err;
		}
	}
}
