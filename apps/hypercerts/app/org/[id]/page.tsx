"use client";

import { orpc } from "@/lib/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { Address } from "viem";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHypercerts, useHypercertsOrganization } from "@workspace/sdk";

export default async function OrganizationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ address: Address; redirectUrl: string }>;
}) {
  const { id } = await params;
  const { address, redirectUrl } = await searchParams;

  return (
    <div className="">
      <h3 className="text-lg font-bold">Organization</h3>
      <Organization id={id} />
    </div>
  );
}

function Organization({ id }: { id: string }) {
  const { data: org } = useQuery(
    orpc.organization.get.queryOptions({ input: { id } })
  );

  if (!org) {
    return <div>Loading...</div>;
  }
return <div>
    <pre>{JSON.stringify(org, null, 2)}</pre>;


<UpdateMembers id={id} />
</div>
}

// function UpdateMembers({ id }: { id: string }) {
//   const { data: org } = useQuery(
//     orpc.organization.get.queryOptions({ input: { id } })
//   );

//   return <div>
//     <h3>Update Members</h3>
//     <div className="flex gap-2">
//       <Button>Update Members</Button>
//     </div>
//   </div>;
// }

function UpdateMembers({ id }: { id: string }) {
  const { sdk } = useHypercerts();
  const [address, setAddress] = useState<string | null>(null);
  const { data: organization, isPending } = useHypercertsOrganization();
  if (isPending) return <div>Loading...</div>;
  if (!organization) return <div>No organization found</div>;

  const buttons = Object.entries({
    add: "Add Member",
    remove: "Remove Member",
  }).map(([op, label]) => (
    <Button
      disabled={!address}
      onClick={async () => {
        const tx = await sdk?.organization.updateMembers({ address, op });
        console.log("tx", tx);
        const txHash = await sendTransaction(tx!);
        console.log("txHash", txHash);
      }}
    >
      {label}
    </Button>
  ));
  return (
    <div>
      <pre>{JSON.stringify(organization, null, 2)}</pre>
      <Input
        value={address ?? ""}
        onChange={(e) => setAddress(e.target.value)}
      />
      {buttons}
    </div>
  );
}
