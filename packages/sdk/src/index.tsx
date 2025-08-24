import ky from 'ky';
import { Logger } from './lib/logger';
import { initSafe } from './lib/safe';
import { Eip1193Provider } from '@safe-global/protocol-kit';
import { Address, Chain, createPublicClient, http, PublicClient } from 'viem';
import { Transaction } from '@safe-global/types-kit';
import {
	MetaTransactionData,
	SafeTransaction,
} from '@safe-global/safe-core-sdk-types';
import { baseSepolia } from 'viem/chains';
export { HypercertsProvider, useHypercerts } from './components/provider';
export { useHypercertsAccount, useHypercertsOrganization } from './hooks';

const HYPERCERTS_URL = 'http://localhost:3000';

const api = ky.create({
	prefixUrl: HYPERCERTS_URL,
});

const chains: Record<number, Chain> = {
	[baseSepolia.id]: baseSepolia,
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
		get: async (owner: Address): Promise<Address> => {
			Logger.info('Getting organization', owner);
			const provider = getRpcUrl(this.#publicClient);
			const safe = await initSafe({ provider, owners: [owner] });
			return await safe.getAddress();
		},
		create: async (owner: Address): Promise<Transaction> => {
			Logger.info('Creating organization', owner);
			const provider = getRpcUrl(this.#publicClient);
			const safe = await initSafe({ provider, owners: [owner] });
			return await safe.createSafeDeploymentTransaction();
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
			return await safe.getOwners();
		},
		updateMembers: async (
			data: {
				address: Address;
				op: 'add' | 'remove';
			},
		): Promise<SafeTransaction | undefined> => {
			Logger.info('Updating organization members', data);
			const { address, op } = data;
			const provider = getRpcUrl(this.#publicClient);
			const safe = await initSafe({ provider, owners: [address] });

			const owners = await safe.getOwners();
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
