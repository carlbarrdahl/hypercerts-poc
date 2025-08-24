import { useHypercerts } from "../components/provider";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

export function useHypercertsAccount(address: Address) {
    const { sdk } = useHypercerts();
    return useQuery({
      queryKey: ["account", address],
      queryFn: () => sdk?.account.get(address!),
      enabled: !!address,
    });
  }
  
  export function useHypercertsOrganization(address: Address) {
    const { sdk } = useHypercerts();
    return useQuery({
      queryKey: ["organization", address],
      queryFn: async () => {
        const organization = await sdk?.organization.get(address!);
        if (!organization) return null;
        const members = await sdk?.organization.members(organization!);
        return { organization, members };
      },
      enabled: !!address,
    });
  }
  