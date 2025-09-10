import { baseSepolia, hardhat } from 'viem/chains';

export const config = {
	[hardhat.id]: {
		indexer: 'http://localhost:42069/graphql',
		easIndexer: '',
	},
	[baseSepolia.id]: {
		indexer: 'http://localhost:42069/graphql',
		easIndexer: 'https://base-sepolia.easscan.org/graphql',
	},
};
