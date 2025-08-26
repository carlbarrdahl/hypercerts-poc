"use client";

import { Button } from "@workspace/ui/components/button";
import { useHypercerts, useHypercertsCreateAttestation } from "@workspace/sdk";
import {
  useAccount,
  useSendTransaction,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { useEffect, useState } from "react";
import { baseSepolia } from "wagmi/chains";
import {
  useHypercertsAccount,
  useHypercertsAttestations,
} from "@workspace/sdk";
import { Address } from "viem";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

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
        <Attestations />
        {/* <CreateOrganization /> */}
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

function Attestations() {
  const { sdk } = useHypercerts();
  const { address } = useAccount();
  const { data: account } = useHypercertsAccount(address!);
  console.log("account", account)
  const { data, isPending } = useHypercertsAttestations(
    {
      where: {
        attester: { in: account || [] },
      },
    },
    {
      enabled: !!address,
    }
  );

  console.log("data", data);

  return (
    <div>
      <h3 className="font-bold">My Hypercerts</h3>
      <div
        className={cn("border rounded p-2 min-h-[200px]", {
          "animate-pulse": isPending,
        })}
      >
        {data?.map((a) => (
          <div key={a.id}>
            <pre>{JSON.stringify(a, null, 2)}</pre>
          </div>
        ))}
      </div>
      <CreateAttestation />
    </div>
  );
}

function CreateAttestation() {
  const { sdk } = useHypercerts();
  const { address } = useAccount();
  const { data: client } = useWalletClient();
  console.log("client", client);
  const [text, setText] = useState("");
  const {
    mutate: createAttestation,
    isPending,
    error,
  } = useHypercertsCreateAttestation(client!);
  console.log({ isPending, error });
  return (
    <form
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        createAttestation({
          recipient: address as Address,
          data: text,
        });
      }}
    >
      <Input
        placeholder="Enter some text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button disabled={isPending || !text} isLoading={isPending} type="submit" loadingText="Creating...">
        Create Attestation
      </Button>
    </form>
  );
}

// function CreateOrganization() {
//   const { sdk } = useHypercerts();
//   const { address } = useAccount();
//   const { data: client } = useWalletClient();

//   const { sendTransaction } = useSendTransaction();
//   console.log("client", client);
//   if (!address) return <div>Connect your wallet</div>;
//   return (
//     <div>
//       <Button
//         onClick={async () => {
//           try {
//             console.log("creating organization", address, client);
//             const tx = await sdk?.organization.create(address);
//             console.log("tx", tx, sdk);
//             const txHash = await sendTransaction(tx!);
//             console.log("txHash", txHash);
//           } catch (error) {
//             console.error(error);
//           }
//         }}
//       >
//         Create Organization
//       </Button>
//     </div>
//   );
// }
