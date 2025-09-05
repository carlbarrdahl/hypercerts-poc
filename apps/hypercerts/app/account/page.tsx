"use client";

import { useHypercerts, useHypercertsAccount } from "@workspace/sdk";
import { useHypercertsAttestations } from "@workspace/sdk";
import { Address, createWalletClient, custom, Hex } from "viem";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useEffect, useState } from "react";
import { useHypercertsCreateAttestation } from "@workspace/sdk";
import { useAddress } from "@/hooks/useAccount";
import { useQuery } from "@tanstack/react-query";
import { baseSepolia } from "viem/chains";
import {
  useAccount,
  useConnectedUser,
  useSmartAccountClient,
  useUser,
} from "@account-kit/react";
import { UpdateOwners } from "@/components/update-owners";

export default function AccountPage() {
  const user = useUser();
  const connected = useConnectedUser();
  const account = useAccount({
    type: "MultiOwnerLightAccount",
  });
  const client = useSmartAccountClient({
    type: "ModularAccountV2",
  })

  console.log("account", account);
  console.log("connected", connected);
  console.log("client", client);

  useEffect(() => {
    if (account?.address) {
      // console.log("account", account);
    }
  }, [account]);
  // console.log("client", client);
  return (
    <div>
      <h3 className="font-bold mb-4">Account Page</h3>
      <div></div>
      <pre className="text-xs  overflow-y-auto">
        {JSON.stringify({ user, connected, account }, null, 2)}
      </pre>


<UpdateOwners />
      {/* <Attestations /> */}
    </div>
  );
}

function Attestations() {
  const { address } = useAddress();
  const { data: account } = useHypercertsAccount(address!);

  const { data: attestations, isPending } = useHypercertsAttestations(
    {
      where: {
        attester: { in: account || [] },
      },
    },
    {
      enabled: !!address,
    }
  );

  return (
    <div>
      <h3 className="font-bold">My Hypercerts</h3>
      <div
        className={cn("border rounded p-2 min-h-[200px]", {
          "animate-pulse": isPending,
        })}
      >
        {attestations?.map((a) => (
          <div key={a.id}>
            <pre className="text-xs">{JSON.stringify(a, null, 2)}</pre>
          </div>
        ))}
      </div>
      {/* <CreateAttestation /> */}
    </div>
  );
}

// export function usePrivySigner() {
//   const { wallets } = useWallets();
//   return useQuery({
//     queryKey: ["privy-signer"],
//     queryFn: async () => {
//       const wallet = wallets?.find((w) => w.walletClientType === "privy");
//       if (!wallet) return null;
//       const account = await toViemAccount({ wallet });
//       await wallet.switchChain(baseSepolia.id);
//       console.log("account", account);
//       const provider = await wallet.getEthereumProvider();
//       console.log("provider", provider);
//       return createWalletClient({
//         account: account.address as Hex,
//         chain: baseSepolia,
//         transport: custom(provider),
//       });
//     },
//     enabled: !!wallets?.length,
//   });
// }
// function CreateAttestation() {
//   const { sdk } = useHypercerts();
//   const { address } = useAddress();
//   const { data: client } = usePrivySigner();
//   console.log("client", client);
//   const [text, setText] = useState("");
//   const {
//     mutate: createAttestation,
//     isPending,
//     error,
//   } = useHypercertsCreateAttestation(client as any);
//   return (
//     <form
//       className="flex gap-2"
//       onSubmit={async (e) => {
//         e.preventDefault();
//         createAttestation({
//           recipient: address as Address,
//           data: text,
//         });
//       }}
//     >
//       <Input
//         placeholder="Enter some text..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />
//       <Button
//         disabled={isPending || !text}
//         isLoading={isPending}
//         type="submit"
//         loadingText="Creating..."
//       >
//         Create Attestation
//       </Button>
//     </form>
//   );
// }
