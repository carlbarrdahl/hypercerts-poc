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
import {
	ContributorPage,
	AttestationPage,
	AttestationVariables,
} from '../lib/indexer';
import { Attestation } from '../lib/indexer';
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

	return useQuery({
		queryKey: ['vaults', { variables }],
		queryFn: () => sdk?.indexer.vault.query(variables) ?? null,
		enabled: Boolean(sdk),
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
		queryFn: () => sdk?.indexer.contributor.query(variables) ?? null,

		...opts,
	});
}

export function useListFunders(
	variables: ContributorsVariables,
	opts?: Opts,
): UseQueryResult<ContributorPage | null | undefined, Error> {
	const { sdk } = useHypercerts();
	return useQuery({
		queryKey: ['funders', { variables }],
		queryFn: () => sdk?.indexer.funder.query(variables) ?? null,
		...opts,
	});
}

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

export function useHypercertsAttestations(
	query: AttestationVariables,
	opts?: Opts,
): UseQueryResult<AttestationPage | null | undefined, Error> {
	const { sdk } = useHypercerts();

	console.log('sdk', query);
	return useQuery({
		queryKey: ['attestations', query],
		queryFn: async () => sdk?.indexer.attestation.query(query),
		...opts,
	});
}
