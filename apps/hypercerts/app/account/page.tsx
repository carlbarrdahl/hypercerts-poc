"use client";

import { useQuery } from "@tanstack/react-query";
import { useHypercerts } from "@workspace/sdk";
import { Button } from "@workspace/ui/components/button";
import { useEffect } from "react";
import { useAccount } from "wagmi";
export default function AccountPage() {
  const { sdk } = useHypercerts();
  console.log("sdk", sdk);

  const { address } = useAccount();
  const { data: account } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const account = await sdk?.account.get();
      console.log(
        "owners",
        await account?.account.getOwnerAddresses().catch(console.error)
      );

      return account;
      return {
        ...account?.account,
        owners: await account?.account.getOwnerAddresses(),
      };
    },
  });
  const { data: org } = useQuery({
    queryKey: ["org"],
    queryFn: () => sdk?.organization.create(),
  });

  console.log("address", address);
  console.log("account", account);
  console.log("org", org);
  return (
    <div>
      <h1>Account</h1>
      <pre>{JSON.stringify(address, null, 2)}</pre>

      <Button
        onClick={() =>
          account?.updateOwners({
            ownersToAdd: [address],
            ownersToRemove: [],
          })
        }
      >
        Add owner
      </Button>
      <pre>{JSON.stringify(account?.account, null, 2)}</pre>
      <pre>{JSON.stringify(org?.account, null, 2)}</pre>
    </div>
  );
}
