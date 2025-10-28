"use client";

import {
  useSignerStatus,
  useSmartAccountClient,
  useAuthModal,
  useSendUserOperation,
  useAccount,
} from "@account-kit/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Address } from "viem";
import { WalletClientSigner } from "@aa-sdk/core";
import { alchemy, baseSepolia } from "@account-kit/infra";
import {
  createMultiOwnerLightAccountAlchemyClient,
  updateMultiOwnerLightAccountOwners,
} from "@account-kit/smart-contracts";

// function useAddOwner() {
//   const { client } = useSmartAccountClient({});

//   const { sendUserOperationResult, sendUserOperation } = useSendUserOperation({
//     client,
//     waitForTxn: true,
//     onError: (error) => {
//       console.log("onError", error);
//     },
//     onSuccess: () => {
//       console.log("onSuccess");
//     },
//     onMutate: () => {
//       console.log("onMutate");
//     },
//   });

//   // sendUserOperation({
//   //   uo: {
//   //     target: NFT_CONTRACT_ADDRESS,
//   //     data: encodeFunctionData({
//   //       abi: NFT_MINTABLE_ABI_PARSED,
//   //       functionName: "mintTo",
//   //       args: [client.getAddress()],
//   //     }),
//   //   },
//   // });
// }
function useHyperAccount() {
  const { client } = useSmartAccountClient({});
  // const { account } = useAccount({
  //   type: "MultiOwnerLightAccount",
  // });
  // console.log("account", account);

  return useQuery({
    queryKey: ["hyperAccount", client],
    queryFn: async () => {
      if (!client) return null;
      try {
        console.log("client", client);
        const account = await createMultiOwnerLightAccountAlchemyClient({
          transport: alchemy({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
          }),
          chain: client.chain!,
          signer: new WalletClientSigner(client, "id"),
        });

        console.log("account", account);
        return account;
      } catch (error) {
        console.log("error", error);
      }
      return null;
      // const owners = await account.getOwnerAddresses();
      // console.log("owners", owners);
      // return {
      //   owners,
      //   address: account.address,
      // };
    },
    enabled: Boolean(client),
  });
}

import { createLightAccountClient } from "@account-kit/smart-contracts";
function useUpdateOwners() {
  const { client } = useSmartAccountClient({});

  return useMutation({
    mutationFn: async () => {
      console.log("client", client);
      if (!client) return;
      try {
        const account = await createMultiOwnerLightAccountAlchemyClient({
          transport: alchemy({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
          }),
          chain: client.chain,
          signer: new WalletClientSigner(client, "id"),
        });
      } catch (error) {
        console.log("error", error);
      }
      console.log("account", account);
    },
  });
  // // updateMultiOwnerLightAccountOwners()
  // return createMultiOwnerLightAccountAlchemyClient({
  //   transport: alchemy({ apiKey: ALCHEMY_API_KEY }),
  //   chain: client.chain!,
  //   signer: new WalletClientSigner(client, "id"),
  // });

  // const lightAccountClient = createLightAccountClient({
  //   signer,
  //   transport,
  //   chain,
  // });
  // const txHash = await updateOwners(lightAccountClient, {
  //   ownerstoAdd: [newOwnerAddress], // or empty if you just want to remove owners
  //   ownersToRemove: [oldOwnerAddress], // or empty if you just want to add owners
  //   waitForTxn: true, // set to false to return a uoHash instead
  // });
}

export function LinkAccount({ address }: { address: Address }) {
  // const { client } = useSmartAccountClient({
  //   type: "MultiOwnerLightAccount",
  // });
  // console.log("client", client);
  const { mutate: updateOwners } = useUpdateOwners();
  // const account = useHyperAccount();
  // console.log("account", account);
  // account?.isAccountDeployed?.().then(console.log);
  // const { sendUserOperationResult, sendUserOperation } = useSendUserOperation({
  //   client,
  //   waitForTxn: true,
  //   onError: (error) => {
  //     console.log("onError", error);
  //   },
  //   onSuccess: () => {
  //     console.log("onSuccess");
  //   },
  //   onMutate: () => {
  //     console.log("onMutate");
  //   },
  // });

  // console.log("client", client);
  return (
    <div>
      <h3 className="text-lg font-bold">Link account</h3>
      <div className="py-4">
        Procceed to link this address:{" "}
        <code className="text-sm bg-background text-foreground rounded-md p-1 block">
          {address}
        </code>
      </div>

      <AuthCheck>
        <Button
          className="w-full"
          onClick={() => updateOwners(`Link Account ${address}`)}
        >
          Link Account
        </Button>
      </AuthCheck>
    </div>
  );
}

function AuthCheck({ children }: { children: React.ReactNode }) {
  const signerStatus = useSignerStatus();
  const { openAuthModal } = useAuthModal();
  const { client } = useSmartAccountClient({});

  // console.log("client", client);
  if (signerStatus.isConnected) {
    return <>{children}</>;
  }
  if (signerStatus.isInitializing || signerStatus.isAuthenticating) {
    return (
      <Button className="w-full" disabled>
        Loading...
      </Button>
    );
  }
  return (
    <Button className="w-full" onClick={() => openAuthModal()}>
      Login
    </Button>
  );
}
