import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { config } from '../config';
import { gql } from '@urql/core';
import { Address } from 'viem';

const vaultsQuery = gql`
	query Vaults(
		$where: vaultFilter
		$orderBy: String
		$orderDirection: String
		$before: String
		$after: String
		$limit: Int
	) {
		vaults(
			where: $where
			orderBy: $orderBy
			orderDirection: $orderDirection
			before: $before
			after: $after
			limit: $limit
		) {
			items {
				id
				parent
				percent
				token
				metadata
			}
			totalCount
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`;
const contributorsQuery = gql`
	query Contributors(
		$where: contributorFilter
		$orderBy: String
		$orderDirection: String
		$before: String
		$after: String
		$limit: Int
	) {
		contributors(
			where: $where
			orderBy: $orderBy
			orderDirection: $orderDirection
			before: $before
			after: $after
			limit: $limit
		) {
			items {
				vault
				address
				assets
				shares
				token
				createdAt
				updatedAt
			}
			totalCount
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
		}
	}
`;

const fundersQuery = gql`
	query Funders(
		$where: funderFilter
		$orderBy: String
		$orderDirection: String
		$before: String
		$after: String
		$limit: Int
	) {
		funders(
			where: $where
			orderBy: $orderBy
			orderDirection: $orderDirection
			before: $before
			after: $after
			limit: $limit
		) {
			items {
				vault
				address
				assets
				token
				createdAt
				updatedAt
			}
		}
	}
`;
// GraphQL Types
type Token = {
	address: Address;
	symbol: string;
	decimals: number;
};
export type Vault = {
	id: string;
	parent?: string;
	percent: string;
	metadata: string;
	token: Token;
	createdAt: string;
	updatedAt: string;
};
export type Contributor = {
	address?: Address;
	vault?: Address;
	assets: string;
	shares: string;
	createdAt: string;
	updatedAt: string;
};
export type Funder = {
	address?: Address;
	vault?: Address;
	assets: string;
	shares: string;
	createdAt: string;
	updatedAt: string;
};
export type FunderFilter = {
	AND?: FunderFilter[];
	OR?: FunderFilter[];
	vault?: string;
	vault_in?: string[];
	vault_not_in?: string[];
	address?: string;
	address_in?: string[];
	address_not_in?: string[];
	assets_gte?: string;
	assets_lte?: string;
	shares_gte?: string;
	shares_lte?: string;
};
export type ContributorsFilter = {
	AND?: ContributorsFilter[];
	OR?: ContributorsFilter[];
	vault?: string;
	vault_in?: string[];
	vault_not_in?: string[];
	address?: string;
	address_in?: string[];
	address_not_in?: string[];
	assets_gte?: string;
	assets_lte?: string;
	shares_gte?: string;
	shares_lte?: string;
};
export type VaultFilter = {
	AND?: VaultFilter[];
	OR?: VaultFilter[];
	id?: string;
	id_in?: string[];
	id_not_in?: string[];
	parent?: string;
	parent_in?: string[];
	parent_not_in?: string[];
	percent_gte?: string;
	percent_lte?: string;
};

export type VaultOrderBy =
	| 'id'
	| 'parent'
	| 'percent'
	| 'metadata'
	| 'createdAt'
	| 'updatedAt';
export type ContributorOrderBy =
	| 'vault'
	| 'address'
	| 'assets'
	| 'shares'
	| 'createdAt'
	| 'updatedAt';

export type FunderOrderBy =
	| 'vault'
	| 'address'
	| 'assets'
	| 'shares'
	| 'createdAt'
	| 'updatedAt';

export type Page<T> = {
	items: T[];
	totalCount: number;
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor?: string;
		endCursor?: string;
	};
};
export type ContributorPage = Page<Contributor>;
export type FunderPage = Page<Funder>;
export type VaultPage = Page<Vault>;

export type Meta = {
	block: {
		number: number;
		hash: string;
		timestamp: number;
	};
};

// Query Variables Types
export type VaultVariables = {
	id: string;
};

export type VaultsVariables = {
	where?: VaultFilter;
	orderBy?: VaultOrderBy;
	orderDirection?: 'asc' | 'desc';
	before?: string;
	after?: string;
	limit?: number;
};

export type ContributorsVariables = {
	where?: ContributorsFilter;
	orderBy?: ContributorOrderBy;
	orderDirection?: 'asc' | 'desc';
	before?: string;
	after?: string;
	limit?: number;
};
export type FunderVariables = {
	where?: FunderFilter;
	orderBy?: FunderOrderBy;
	orderDirection?: 'asc' | 'desc';
	before?: string;
	after?: string;
	limit?: number;
};
export function createIndexer(chain: keyof typeof config) {
	const url = config[chain]?.indexer;
	if (!url) throw new Error('Indexer URL not found');
	const client = new Client({
		url,
		exchanges: [
			// cacheExchange,
			fetchExchange,
		],
		preferGetMethod: false,
		requestPolicy: 'network-only',
	});

	return {
		vault: {
			query: async (variables: VaultsVariables = {}) => {
				return client
					.query(vaultsQuery, variables)
					.toPromise()
					.then((r) => (r.data?.vaults ?? []) as VaultPage);
			},
		},
		contributor: {
			query: async (variables: ContributorsVariables = {}) => {
				return client
					.query(contributorsQuery, variables)
					.toPromise()
					.then((r) => (r.data?.contributors ?? []) as ContributorPage);
			},
		},
		funder: {
			query: async (variables: FunderVariables = {}) => {
				return client
					.query(fundersQuery, variables)
					.toPromise()
					.then((r) => (r.data?.funders ?? []) as FunderPage);
			},
		},
	};
}
