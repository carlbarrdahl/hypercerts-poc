import ky from 'ky';
import { Logger } from './lib/logger';
import { initSafe } from './lib/safe';
import { Eip1193Provider } from '@safe-global/protocol-kit';
import {
	Address,
	Chain,
	createPublicClient,
	getAddress,
	http,
	PublicClient,
	WalletClient,
} from 'viem';
import { Transaction } from '@safe-global/types-kit';
import {
	MetaTransactionData,
	SafeTransaction,
} from '@safe-global/safe-core-sdk-types';
import { baseSepolia } from 'viem/chains';

export { HypercertsProvider, useHypercerts } from './components/provider';
export * from './hooks';

const HYPERCERTS_URL = 'http://localhost:3000';

const api = ky.create({
	prefixUrl: HYPERCERTS_URL,
});

const chains: Record<number, Chain> = {
	[baseSepolia.id]: baseSepolia,
};

export type OrganizationAccount = {
	version: string;
	members: Address[];
	threshold: number;
	nonce: number;
	address: Address;
};

const getRpcUrl = (publicClient: PublicClient) => {
	const url = publicClient.chain?.rpcUrls.default.http[0];
	if (!url) throw new Error('No RPC URL found');
	return url;
};

export class HypercertSDK {
	#publicClient: PublicClient;
	constructor(opts: { chainId: keyof typeof chains }) {
		this.#publicClient = createPublicClient({
			chain: chains[opts?.chainId ?? baseSepolia.id],
			transport: http(),
		});
	}

	account = {
		link: async (data: {
			address: string;
			redirectUrl: string;
		}): Promise<string> => {
			Logger.info('Linking account', data);

			return `${HYPERCERTS_URL}/account/link?address=${data.address}&redirectUrl=${encodeURIComponent(data.redirectUrl)}`;
		},
		get: async (address: string): Promise<any> => {
			Logger.info('Getting account', address);
			return ky
				.post(`http://localhost:3000/api/account/get`, { json: { address } })
				.json();
		},
	};
	cert = {
		create: async (data: {}): Promise<string> => {
			Logger.info('Creating certificate', data);
			return '';
		},
	};
	organization = {
		get: async (safeAddress: Address): Promise<OrganizationAccount> => {
			Logger.info('Getting organization with address:', safeAddress);
			const provider = getRpcUrl(this.#publicClient);
			const safe = await initSafe({ provider, safeAddress });

			const version = await safe.getContractVersion();
			const members = await safe.getOwners();
			const threshold = await safe.getThreshold();
			const nonce = await safe.getNonce();
			const address = await safe.getAddress().then(getAddress);
			return { version, address, nonce, threshold, members };
		},
		create: async (
			owner: Address,
		): Promise<OrganizationAccount & { tx: Transaction }> => {
			Logger.info('Creating organization', owner);
			const provider = getRpcUrl(this.#publicClient);
			const safe = await initSafe({ provider, owners: [owner] });
			console.log(safe)
			const tx = await safe.createSafeDeploymentTransaction();
			console.log(tx)
			const account = await this.organization.get(await safe.getAddress());
			console.log(account)
			return { ...account, tx };
		},

		list: async (): Promise<{}> => {
			Logger.info('Listing organizations');
			return ky
				.post(`http://localhost:3000/api/organization/list`, { json: {} })
				.json();
		},
		members: async (address: Address): Promise<Address[]> => {
			Logger.info('Getting organization members', address);
			const provider = getRpcUrl(this.#publicClient);
			const safe = await initSafe({ provider, owners: [address] });
			return await safe.getOwners().then((owners) => owners.map(getAddress));
		},
		updateMembers: async (data: {
			safeAddress: Address;
			address: Address;
			op: 'add' | 'remove';
		}): Promise<SafeTransaction | undefined> => {
			Logger.info('Updating organization members', data);
			const { safeAddress, address, op } = data;
			const provider = getRpcUrl(this.#publicClient);
			const safe = await initSafe({ provider, safeAddress });

			console.log(await safe.getChainId());
			console.log('safe', safe);
			const owners = await safe.getOwners();
			console.log('owners', owners);
			// TODO: Check safe.getOwners() to see if the address is already part of the Organization
			if (op === 'add')
				return await safe.createAddOwnerTx({ ownerAddress: address });
			if (op === 'remove')
				return await safe.createRemoveOwnerTx({ ownerAddress: address });
		},
		sendTransaction: async (
			data: {
				owner: Address;
				transactions: MetaTransactionData[];
			},
			provider: Eip1193Provider,
		): Promise<SafeTransaction | undefined> => {
			Logger.info('Sending transaction', data);
			const { owner, transactions } = data;
			const safe = await initSafe({ provider, owners: [owner] });
			return await safe.createTransaction({ transactions });
		},
	};
}
