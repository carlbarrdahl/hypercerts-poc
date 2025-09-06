import ky from 'ky';
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
} from 'viem';
import { Logger } from './lib/logger.js';
// import {
// 	ComethSmartAccountClient,
// 	createSafeSmartAccount,
// 	createSmartAccountClient,
// 	createSafeSmartAccount,
// } from '@cometh/connect-sdk-4337';

import {
	createSmartAccountClient,
	createSmartAccountClientFromExisting,
	toSmartContractAccount,
} from '@aa-sdk/core';
import deployments from './deployments.json';
import { waitForTransactionReceipt, writeContract } from 'viem/actions';

export { HypercertsProvider, useHypercerts } from './components/provider';
export * from './hooks';

const HYPERCERTS_URL = 'http://localhost:3000';

const apiKey = process.env.COMETH_API_KEY;
const bundlerUrl = process.env.COMETH_4337_BUNDLER_URL;

const api = ky.create({
	prefixUrl: HYPERCERTS_URL,
});

const { HyperVaultDeployer, HyperVault } = deployments[31337];

type Deployer = (typeof deployments)[31337]['HyperVaultDeployer'];
type HyperVault = (typeof deployments)[31337]['HyperVault'];

export type HyperVaultConfig = {
	parent?: Address;
	asset: Address;
	percent: bigint;
	metadata: string;
};
export class HypercertsSDK {
	#client: WalletClient;
	#publicClient: PublicClient;
	// #deployer: typeof HyperVaultDeployer;
	// #vault: typeof HyperVault;
	#abi = {
		HyperVaultDeployer: HyperVaultDeployer.abi as unknown as Abi,
		HyperVault: HyperVault.abi as unknown as Abi,
	};
	#factory: GetContractReturnType<typeof HyperVaultDeployer.abi, WalletClient>;
	#vault: (
		address: Address,
	) => GetContractReturnType<typeof HyperVault.abi, WalletClient>;

	test?: { token: Address };
	constructor(wallet?: WalletClient) {
		const chain = wallet?.chain;
		if (!wallet || !chain?.id) throw new Error('Chain ID not found');

		this.#client = wallet;
		this.#publicClient = createPublicClient({ chain, transport: http() });
		const client = { public: this.#publicClient, wallet };

		// const { HyperVault, HyperVaultDeployer } =
		// 	deployments[chain.id as unknown as '31337'];
		// this.#vault = {abi:HyperVault.abi, address: getAddress(HyperVault.address)};
		// this.#deployer = HyperVaultDeployer;

		const address = getAddress(
			deployments[chain.id as unknown as '31337'].HyperVaultDeployer.address,
		);
		this.#factory = getContract({
			address,
			abi: HyperVaultDeployer.abi,
			client,
		});
		this.#vault = (address: Address) =>
			getContract({ address, abi: HyperVault.abi, client });

		// this.#indexer = createIndexer(client.chain.id)

		this.test = {
			token: deployments[chain.id as unknown as '31337'].TestToken.address as Address,
		};
	}
	vault = {
		create: async ({
			parent = '0x0000000000000000000000000000000000000000',
			asset,
			percent,
			metadata,
		}: HyperVaultConfig) => {
			console.log('creating vault', { parent, asset, percent, metadata });
			return this.#simulateWriteAndFindEvent({
				contract: this.#factory,
				functionName: 'create',
				args: [[getAddress(parent), getAddress(asset), percent, metadata]],
				abi: this.#abi.HyperVaultDeployer,
				eventName: 'Created',
			});
		},
		update: async (id: Address, config: HyperVaultConfig) => {
			const contract = this.#vault(getAddress(id));
			return this.#simulateWriteAndFindEvent({
				contract,
				functionName: 'update',
				args: [config],
				abi: this.#abi.HyperVault,
				eventName: 'Updated',
			});
		},
		deposit: async (id: Address, amount: bigint) => {
			const receiver = this.#client.account?.address as Address | undefined;
			if (!receiver) throw new Error('Wallet account address is required');
			const contract = this.#vault(getAddress(id));
			return this.#simulateWriteAndFindEvent({
				contract,
				functionName: 'deposit',
				args: [amount, receiver],
				abi: this.#abi.HyperVault,
				eventName: 'Deposit',
			});
		},
		withdraw: async (id: Address, amount: bigint) => {
			const receiver = this.#client.account?.address as Address | undefined;
			if (!receiver) throw new Error('Wallet account address is required');
			const contract = this.#vault(getAddress(id));
			return this.#simulateWriteAndFindEvent({
				contract,
				functionName: 'withdraw',
				args: [amount, receiver],
				abi: this.#abi.HyperVault,
				eventName: 'Withdraw',
			});
		},
		fund: async (id: Address, amount: bigint, pushUpstream: boolean = true) => {
			const contract = this.#vault(getAddress(id));
			return this.#simulateWriteAndFindEvent({
				contract,
				functionName: 'fund',
				args: [amount, pushUpstream],
				abi: this.#abi.HyperVault,
				eventName: 'Funded',
			});
		},
		payout: async (id: Address, amount: bigint, recipient: Address) => {
			const contract = this.#vault(getAddress(id));
			return this.#simulateWriteAndFindEvent({
				contract,
				functionName: 'payout',
				args: [amount, recipient],
				abi: this.#abi.HyperVault,
				eventName: 'Payout',
			});
		},
		balance: async (id: Address) =>
			this.#vault(getAddress(id)).read.totalAssets(),

		// this.#factory.create({ parent, asset, metadata: await upload(metadata) }),
		//     update: async (id: string; { parent, asset, metadata }) =>
		//         this.#vault(id).update({ metadata: await upload(metadata)}),
		//     withdraw: async(id: string, amount: bigint) =>
		//         this.#vault(id).withdraw(amount, this.#client.address),
		//     fund: async (id: string, amount: bigint, recipient: string) => {},
		//     payout: async (id: string, amount: bigint, recipient: string) => {},
		//     balance: async(id: string) =>
		//         this.#vault(id).totalAssets(),
		//     query: async(variables) =>
		//         this.#indexer.query(vaultQuery, variables)
	} as const;
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
			const { request, ...rest } = await (contract.simulate as any)[functionName](
				args ?? [],
			);
			console.log('request', {request}, rest);
			const hash = await (contract.write as any)[functionName](request);
			console.log('hash', hash);
			const receipt = await waitForTransactionReceipt(this.#publicClient, {
				hash,
			});
			const logs = parseEventLogs({ abi, logs: receipt.logs });
			const event: any = logs.find((log: any) => log.eventName === eventName);
			return event as T;
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
