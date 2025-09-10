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
import {
	baseSepolia,
	alchemy,
	AlchemySmartAccountClient,
} from '@account-kit/infra';
import deployments from './deployments.json';
import { waitForTransactionReceipt } from 'viem/actions';
import { createIndexer, VaultPage } from './lib/indexer';
import { VaultsVariables } from './lib/indexer';
import { config } from './config';
import {
	createMultiOwnerLightAccountAlchemyClient,
	createMultisigAccountAlchemyClient,
	MultiOwnerLightAccount,
	MultiOwnerLightAccountClientActions,
} from '@account-kit/smart-contracts';
// import { MultiOwnerLightAccount } from '@account-kit/infra';
import {
	LocalAccountSigner,
	SmartAccountClient,
	toSmartContractAccount,
	WalletClientSigner,
} from '@aa-sdk/core';

export { HypercertsProvider, useHypercerts } from './components/provider';
export * from './hooks';
export * from './lib/indexer';

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
	metadata: string;
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
	balance: (
		id: Address,
	) => Promise<{ assets: bigint; shares: bigint; price: bigint }>;
	query: (variables: VaultsVariables) => Promise<VaultPage | null>;
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
	account: AccountMethods;
	vault: VaultMethods;
	test?: { token: Address };
	constructor(wallet?: WalletClient) {
		const chain = wallet?.chain;
		if (!wallet || !chain?.id) throw new Error('Chain ID not found');
		if (!Object.keys(config).includes(String(chain.id)))
			throw new Error('Chain not supported');

		console.log('chain', chain, baseSepolia);
		this.#client = wallet;
		console.log('wallet', wallet);
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

		this.account = {
			get: async () => {
				return createMultiOwnerLightAccountAlchemyClient({
					transport: alchemy({ apiKey: ALCHEMY_API_KEY }),
					chain: this.#client.chain!,
					signer: new WalletClientSigner(this.#client, 'id'),
				});
			},
			updateOwners: async ({ ownersToAdd, ownersToRemove }) => {
				const hyperAccount = await this.account.get();
				const hash = await hyperAccount.updateOwners({
					account: hyperAccount.account,
					ownersToAdd,
					ownersToRemove,
				});

				return hyperAccount.waitForUserOperationTransaction({ hash });
			},
		};
		this.organization = {
			create: async () => {
				const hyperAccount = await this.account.get();
				return createMultisigAccountAlchemyClient({
					transport: alchemy({ apiKey: ALCHEMY_API_KEY }),
					chain: this.#client.chain!,
					signer: new WalletClientSigner(this.#client, 'org'),
					owners: [hyperAccount.account.address],
					threshold: 1n,
				});
			},
		};
		this.vault = {
			create: async (config): Promise<Address> => {
				return this.#simulateWriteAndFindEvent({
					contract: this.#factory,
					functionName: 'create',
					args: [config],
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
				console.log('fund', { id, amount, pushUpstream, receiver });
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
			balance: async (id) => {
				const assets = await this.#vault(getAddress(id))
					.read.totalAssets()
					.then((a) => a as bigint);
				const shares = await this.#vault(getAddress(id))
					.read.convertToShares([assets])
					.then((s) => s as bigint);

				console.log({ assets, shares });
				const price = assets / shares;
				console.log({ price });
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
		};
	}
	// attest = {
	//     create: async(id: string, { type, metadata }) =>
	//         eas.attest({ data: { type: "milestone", recipient: id, metadata: await upload(metadata) }}),
	//     query: async(variables) =>
	//         this.#indexer.query(attestQuery, variables)
	// }
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
			console.log(event);
			return event.args as T;
		} catch (err: any) {
			console.log('err', err);
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

// export class HypercertSDK {
// #client: WalletClient;
// #publicClient: PublicClient;

// 	constructor(client: WalletClient) {
// 		this.#client = client;
// this.#publicClient = createPublicClient({
// 	chain: client.chain,
// 	transport: http(),
// });
// 	}

// 	account = {
// 		link: async (data: {
// 			address: string;
// 			redirectUrl: string;
// 		}): Promise<string> => {
// 			Logger.info('Linking account', data);
// 			return `${HYPERCERTS_URL}/account/link?address=${data.address}&redirectUrl=${encodeURIComponent(data.redirectUrl)}`;
// 		},
// 		get: async (address: string): Promise<ComethSmartAccountClient> => {
// 			Logger.info('Getting account', address);
// 			const chain = this.#client.chain;
// 			// const account = await createSafeSmartAccount({
// 			// 	apiKey,
// 			// 	publicClient: this.#client,
// 			// 	chain,
// 			// });

// 			return createSmartAccountClient({
// 				account: toSmartContractAccount(this.#client),
// 				chain,
// 				bundlerTransport: http(bundlerUrl),
// 			});
// 		},
// 	};
// }

// const { request } = await this.#publicClient.simulateContract({
// 	...wagmiContract,
// 	functionName: 'mint',
// 	account,
//   })
