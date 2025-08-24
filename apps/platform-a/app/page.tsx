"use client";

import { Button } from "@workspace/ui/components/button";
import { useHypercerts } from "@workspace/sdk";
import {
  useAccount,
  useSendTransaction,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { useEffect } from "react";
import { baseSepolia } from "wagmi/chains";
import { useHypercertsAccount } from "@workspace/sdk";

export default function Page() {
  const { switchChain } = useSwitchChain();
  useEffect(() => {
    console.log("switching chain");
    switchChain({ chainId: baseSepolia.id });
  }, []);

  return (
    <div>
      <div className="flex justify-center pt-24">
        <LinkAccount />
      </div>
    </div>
  );
}


function LinkAccount() {
  const { address } = useAccount();
  const { sdk } = useHypercerts();

  const { data, isPending } = useHypercertsAccount(address!);

  console.log("data", data);
  if (isPending) return <div>Loading...</div>;
  if (!address) return <div>Connect your wallet</div>;

  if (data) {
    return (
      <div>
        Account linked
        <pre>{data.id}</pre>
        <CreateOrganization />
      </div>
    );
  }

  return (
    <div>
      <Button
        onClick={async () => {
          const link = await sdk?.account.link({
            address,
            redirectUrl: window.location.href,
          });
          console.log(link);
          window.open(link, "_blank");
        }}
      >
        Link Hypercerts Account
      </Button>
    </div>
  );
}

function CreateOrganization() {
  const { sdk } = useHypercerts();
  const { address } = useAccount();
  const { data: client } = useWalletClient();

  const { sendTransaction } = useSendTransaction();
  console.log("client", client);
  if (!address) return <div>Connect your wallet</div>;
  return (
    <div>
      <Button
        onClick={async () => {
          console.log("creating organization", address, client);
          const tx = await sdk?.organization.create(address);
          console.log("tx", tx);
          const txHash = await sendTransaction(tx!);
          console.log("txHash", txHash);
        }}
      >
        Create Organization
      </Button>
    </div>
  );
}

