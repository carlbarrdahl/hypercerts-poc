"use client";

import Link from "next/link";
import { useSendTransaction } from "@privy-io/react-auth";

import { useHypercerts, useHypercertsPrepareOrganization } from "@workspace/sdk";
import { useAddress } from "../hooks/useAccount";

export default function Page() {
  return (
    <div>
      {/* <CreateOrganization /> */}
      <Organisation />
    </div>
  );
}




function Organisation() {
  const { address } = useAddress();
  const { sdk } = useHypercerts();
  // const { data } = useHypercertsOrganization(address!);
  const { data } = useHypercertsPrepareOrganization(address!);
  const { sendTransaction } = useSendTransaction();
console.log({ data})
  if (!data) return <div>Loading...</div>;

  // return <Button onClick={async () => {
  //   const tx = await sdk?.organization.create(address!);

  //   console.log(tx);
  //   sendTransaction(tx!);
  // }}>Create Organization</Button>
  return (
    <div>
      <Link href={`/org/${data.address}`}>
        <pre className="border rounded p-2 hover:bg-muted">
          {JSON.stringify(data, null, 2)}
        </pre>
      </Link>
    </div>
  );
}
