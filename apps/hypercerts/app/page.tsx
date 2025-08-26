"use client";

import Link from "next/link";
import { useSendTransaction, useWallets } from "@privy-io/react-auth";

import {
  useHypercerts,
  useHypercertsOrganization,
  useHypercertsPrepareOrganization,
} from "@workspace/sdk";
import { Button } from "@workspace/ui/components/button";
import { Address } from "viem";

export default function Page() {
  return (
    <div>
      {/* <CreateOrganization /> */}
      <Organisation />
    </div>
  );
}

function useAddress() {
  const { wallets, ready } = useWallets();
  const wallet = wallets?.find((w) => w.walletClientType === "privy");
  const address = wallet?.address as Address;
  return { address, isPending: !ready };
}

function Organisation() {
  const { address } = useAddress();
  const { sdk } = useHypercerts();
  const { data } = useHypercertsPrepareOrganization(address!);
  const { sendTransaction } = useSendTransaction();
  console.log({ data });
  //   if (!data) return <div>Loading...</div>;

  return (
    <Button
      onClick={async () => {
        const tx = await sdk?.organization.create(address!);

        console.log(tx);
        // sendTransaction(tx!);
      }}
    >
      Create Organization
    </Button>
  );
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
