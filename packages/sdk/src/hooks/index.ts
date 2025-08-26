import { useHypercerts } from '../components/provider';
import {
	useMutation,
	UseMutationResult,
	useQuery,
	UseQueryResult,
} from '@tanstack/react-query';
import { Address } from 'viem';
import { OrganizationAccount } from '..';
import { Attestation, AttestationQuery } from '../lib/graphql';
import { AttestationInput } from '../lib/eas';
import { Transaction } from 'viem';
import { TransactionSigner } from '@ethereum-attestation-service/eas-sdk';

export function useHypercertsAccount(
	address: Address,
): UseQueryResult<Address[] | undefined, Error> {
	const { sdk } = useHypercerts();
	return useQuery({
		queryKey: ['account', address],
		queryFn: () => sdk?.account.get(address!),
		enabled: !!address,
	});
}

export function useHypercertsOrganization(
	address: Address,
): UseQueryResult<OrganizationAccount | undefined, Error> {
	const { sdk } = useHypercerts();
	return useQuery({
		queryKey: ['organization', address],
		queryFn: async () => sdk?.organization.get(address!),
		enabled: !!address,
	});
}

export function useHypercertsPrepareOrganization(
	address: Address,
): UseQueryResult<OrganizationAccount | undefined, Error> {
	const { sdk } = useHypercerts();
	return useQuery({
		queryKey: ['organization', address],
		queryFn: async () => sdk?.organization.prepare(address!),
		enabled: !!address,
	});
}

export function useHypercertsCreateAttestation(
	signer: TransactionSigner,
): UseMutationResult<Transaction<string> | undefined, Error, AttestationInput> {
	const { sdk } = useHypercerts();
	return useMutation({
		mutationFn: async (data: AttestationInput) =>
			sdk?.cert.create(data, signer),
	});
}

export function useHypercertsAttestations(
	query: AttestationQuery,
	opts: { enabled?: boolean },
): UseQueryResult<Attestation[] | undefined, Error> {
	const { sdk } = useHypercerts();
	return useQuery({
		queryKey: ['attestations', query],
		queryFn: async () =>
			sdk?.cert.query(query).then(({ data }) => data.attestations),
		...opts,
	});
}
