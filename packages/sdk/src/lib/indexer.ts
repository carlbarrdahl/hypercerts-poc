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
				type
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

const attestationsQuery = gql`
	query Attestations(
		$where: attestationFilter
		$orderBy: String
		$orderDirection: String
		$before: String
		$after: String
		$limit: Int
	) {
		attestations(
			where: $where
			orderBy: $orderBy
			orderDirection: $orderDirection
			before: $before
			after: $after
			limit: $limit
		) {
			items {
				id
				time
				refUID
				recipient
				attester
				schema
				decodedParsed
				createdAt
				updatedAt
				isOffchain
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
// GraphQL Types
type Token = {
	address: Address;
	symbol: string;
	decimals: number;
};
export type Vault = {
	id: string;
	owner: Address;
	parent?: Address;
	percent: string;
	metadata: Record<string, any>;
	type?: string | null; // "solution" or "region"
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
export type Attestation = {
	id: string;
	refUID: string;
	recipient: Address;
	attester: Address;
	schema: string;
	decodedParsed: Record<string, unknown>;
	createdAt: Date;
	updatedAt: Date;
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
	type?: string;
	type_in?: string[];
	type_not_in?: string[];
};

export type AttestationFilter = {
	AND?: AttestationFilter[];
	OR?: AttestationFilter[];
	id?: string;
	id_in?: string[];
	id_not_in?: string[];
	recipient?: string;
	recipient_in?: string[];
	recipient_not_in?: string[];
	attester?: string;
	attester_in?: string[];
	attester_not_in?: string[];
	schema?: string;
	schema_in?: string[];
	schema_not_in?: string[];
	decodedParsed?: Record<string, unknown>;
	decodedParsed_in?: Record<string, unknown>[];
	decodedParsed_not_in?: Record<string, unknown>[];
};

export type VaultOrderBy =
	| 'id'
	| 'parent'
	| 'percent'
	| 'metadata'
	| 'type'
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
export type AttestationOrderBy =
	| 'id'
	| 'recipient'
	| 'attester'
	| 'schema'
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
export type AttestationPage = Page<Attestation>;
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
export type AttestationVariables = {
	where?: AttestationFilter;
	orderBy?: AttestationOrderBy;
	orderDirection?: 'asc' | 'desc';
	before?: string;
	after?: string;
	limit?: number;
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
				console.log('variables', variables);
				return client
					.query(vaultsQuery, variables)
					.toPromise()
					.then((r) => {
						console.log('r', r);

						return r;
					})
					.then((r) => mapTimestamps(r.data?.vaults ?? []) as VaultPage)
					.catch((e) => {
						console.error('error', e);
						return null;
					});
			},
		},
		contributor: {
			query: async (variables: ContributorsVariables = {}) => {
				return client
					.query(contributorsQuery, variables)
					.toPromise()
					.then(
						(r) => mapTimestamps(r.data?.contributors ?? []) as ContributorPage,
					);
			},
		},
		funder: {
			query: async (variables: FunderVariables = {}) => {
				return client
					.query(fundersQuery, variables)
					.toPromise()
					.then((r) => mapTimestamps(r.data?.funders ?? []) as FunderPage);
			},
		},
		attestation: {
			query: async (variables: AttestationVariables = {}) => {
				return client
					.query(attestationsQuery, variables)
					.toPromise()
					.then(
						(r) => mapTimestamps(r.data?.attestations ?? []) as AttestationPage,
					);
			},
		},
	};
}

function mapTimestamps<
	T extends { items: T[]; createdAt: number; updatedAt: number },
>(data: T): T {
	return {
		...data,
		items: data.items.map((item) => ({
			...item,
			createdAt: item.createdAt ? new Date(+item.createdAt) : undefined,
			updatedAt: item.updatedAt ? new Date(+item.updatedAt) : undefined,
		})),
	};
}

// Hierarchy Helper Functions

/**
 * Get all child vaults for a given parent vault ID
 */
export async function getVaultChildren(
	indexer: ReturnType<typeof createIndexer>,
	parentId: Address,
): Promise<Vault[]> {
	const result = await indexer.vault.query({
		where: { parent: parentId },
	});
	return result?.items || [];
}

/**
 * Calculate vault level in hierarchy by counting parent hops
 * @returns 0 for Pillar (root), 1 for Sub-Pillar, 2 for Pathway, etc.
 */
export function getVaultLevel(vault: Vault | null | undefined): number {
	if (!vault) return 0;
	if (!vault.parent) return 0;
	// Note: For accurate level calculation with deep hierarchies,
	// you'd need to recursively fetch parent vaults. For now, we use a simple heuristic:
	// - No parent = level 0 (Pillar)
	// - Has parent = we'll need to fetch the parent to determine
	// For the simple 3-level case, we can infer from parent's parent
	return 1; // This will be enhanced in the UI where we have access to all vaults
}

/**
 * Calculate vault level with access to parent vault data
 */
export function calculateVaultLevel(
	vault: Vault | null | undefined,
	parentVault?: Vault | null,
): number {
	if (!vault) return 0;
	if (!vault.parent) return 0; // Root level - Pillar
	if (!parentVault) return 1; // Has parent but parent not loaded - assume Sub-Pillar
	if (!parentVault.parent) return 1; // Parent is root - this is Sub-Pillar
	return 2; // Parent has parent - this is Pathway
}

/**
 * Get label for vault level
 */
export function getVaultLevelLabel(level: number): string {
	const labels = ['Pillar', 'Sub-Pillar', 'Pathway'];
	return labels[level] || `Level ${level}`;
}
