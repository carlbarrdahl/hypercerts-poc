import { useHypercerts } from '../components/provider';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Address } from 'viem';
import { OrganizationAccount } from '..';

export function useHypercertsAccount(
	address: Address,
): UseQueryResult<Address | null, Error> {
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
		queryFn: async () => sdk?.organization.create(address!),
		enabled: !!address,
	});
}
