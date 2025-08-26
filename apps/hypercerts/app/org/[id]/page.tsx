"use client";

import { Button } from "@workspace/ui/components/button";
import { Address } from "viem";
import { useState } from "react";
import { useHypercerts, useHypercertsOrganization } from "@workspace/sdk";
import { Input } from "@workspace/ui/components/input";
import { useSendTransaction } from "@privy-io/react-auth";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="">
      <h3 className="text-lg font-bold">Organization</h3>
      
      <UpdateMembers id={id} />
    </div>
  );
}


function UpdateMembers({ id }: { id: string }) {
  const { sdk } = useHypercerts();
  const [address, setAddress] = useState<string | null>(null);
  const { data: organization, isPending } = useHypercertsOrganization(id);
  if (isPending) return <div>Loading...</div>;
  if (!organization) return <div>No organization found</div>;
  const { sendTransaction } = useSendTransaction();
  const buttons = Object.entries({
    add: "Add Member",
    remove: "Remove Member",
  }).map(([op, label]) => (
    <Button
      key={op}
      disabled={!address}
      onClick={async () => {
        console.log("address", { address, op });
        if (!address) return null;
        const tx = await sdk?.organization.updateMembers({
          safeAddress: id,
          address,
          op: op as "add" | "remove",
        });
        console.log("tx", tx);
        // const txHash = await sendTransaction(tx!);
        // console.log("txHash", txHash);
      }}
    >
      {label}
    </Button>
  ));
  return (
    <div>
      <pre>{JSON.stringify(organization, null, 2)}</pre>
      <Input
        placeholder="0x..."
        value={address ?? ""}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div className="flex gap-1 mt-2">{buttons}</div>
    </div>
  );
}
