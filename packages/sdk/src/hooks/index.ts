import { useHypercerts } from '../components/provider';
import {
	useMutation,
	UseMutationResult,
	useQuery,
	UseQueryResult,
} from '@tanstack/react-query';
// import { OrganizationAccount } from '..';
import { HyperVaultConfig } from '..';
import {
	ContributorsVariables,
	VaultPage,
	VaultsVariables,
} from '../lib/indexer';
import { ContributorPage } from '../lib/indexer';
import { Transaction } from 'viem';
import { AttestationInput } from '../lib/eas';

type Opts = {
	enabled?: boolean;
	refetchInterval?: number;
	select?: (data: any) => any;
};
export function useCreateHypercerts() {
	const { sdk } = useHypercerts();
	return useMutation({
		mutationFn: async (config: HyperVaultConfig) => sdk?.vault.create(config),
	});
}

export function useListHypercerts(
	variables: VaultsVariables,
	opts?: Opts,
): UseQueryResult<VaultPage | null | undefined, Error> {
	const { sdk } = useHypercerts();

	console.log('sdk', sdk);
	return useQuery({
		queryKey: ['vaults', { variables }],
		queryFn: () => sdk?.indexer.vault.query(variables),
		...opts,
	});
}

export function useListContributors(
	variables: ContributorsVariables,
	opts?: Opts,
): UseQueryResult<ContributorPage | null | undefined, Error> {
	const { sdk } = useHypercerts();
	return useQuery({
		queryKey: ['contributors', { variables }],
		queryFn: () => sdk?.indexer.contributor.query(variables),

		...opts,
	});
}

export function useListFunders(
	variables: ContributorsVariables,
	opts?: { enabled?: boolean; refetchInterval?: number },
): UseQueryResult<ContributorPage | null | undefined, Error> {
	const { sdk } = useHypercerts();
	return useQuery({
		queryKey: ['funders', { variables }],
		queryFn: () => sdk?.indexer.funder.query(variables),
		...opts,
	});
}

// export function useHypercertsAccount(
// 	address: Address,
// ): UseQueryResult<Address[] | undefined, Error> {
// 	const { sdk } = useHypercerts();
// 	return useQuery({
// 		queryKey: ['account', address],
// 		queryFn: () => sdk?.account.get(address!),
// 		enabled: !!address,
// 	});
// }

// export function useHypercertsOrganization(
// 	address: Address,
// ): UseQueryResult<OrganizationAccount | undefined, Error> {
// 	const { sdk } = useHypercerts();
// 	return useQuery({
// 		queryKey: ['organization', address],
// 		queryFn: async () => sdk?.organization.get(address!),
// 		enabled: !!address,
// 	});
// }

// export function useHypercertsPrepareOrganization(
// 	address: Address,
// ): UseQueryResult<OrganizationAccount | undefined, Error> {
// 	const { sdk } = useHypercerts();
// 	return useQuery({
// 		queryKey: ['organization', address],
// 		queryFn: async () => sdk?.organization.prepare(address!),
// 		enabled: !!address,
// 	});
// }

export function useHypercertsCreateAttestation(): UseMutationResult<
	Transaction<string> | undefined,
	Error,
	AttestationInput
> {
	const { sdk } = useHypercerts();
	return useMutation({
		mutationFn: async (data: AttestationInput) => sdk?.cert.create(data),
	});
}

// export function useHypercertsAttestations(
// 	query: AttestationQuery,
// 	opts?: { enabled?: boolean },
// ): UseQueryResult<Attestation[] | undefined, Error> {
// 	const { sdk } = useHypercerts();
// 	return useQuery({
// 		queryKey: ['attestations', query],
// 		queryFn: async () =>
// 			sdk?.cert.query(query).then(({ data }) => data.attestations),
// 		...opts,
// 	});
// }
