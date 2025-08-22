"use client";

import { orpc } from "@/lib/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { Address } from "viem";
import { useRouter } from "next/navigation";

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

function UpdateMembers({ id }: { id: string }) {
  const { data: org } = useQuery(
    orpc.organization.get.queryOptions({ input: { id } })
  );

  return <div>
    <h3>Update Members</h3>
    <div className="flex gap-2">
      <Button>Update Members</Button>
    </div>
  </div>;
}