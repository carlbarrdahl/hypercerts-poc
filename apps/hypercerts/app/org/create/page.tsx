"use client";

import { EIP1193Provider, useWallets } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import { createWalletClient, custom, getAddress, WalletClient } from "viem";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  createSmartAccountClient,
  walletClientToCustomSigner,
} from "permissionless";
import { signerToSimpleSmartAccount } from "permissionless/accounts";
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import { createPublicClient, http } from "viem";

export default function CreateOrganizationPage() {
  return (
    <div>
      <h3>Create Organization</h3>

      <CreateOrganization />
    </div>
  );
}

function CreateOrganization() {
  const [signer, setSigner] = useState<WalletClient | null>(null);
  // Find the embedded wallet and get its EIP1193 provider
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  const { mutate: createOrganization, isPending } = useMutation({
    mutationFn: async () => {
      if (!embeddedWallet) return;
      const provider = await embeddedWallet.getEthereumProvider();

      const chain = baseSepolia;
      // Create a viem WalletClient from the embedded wallet's EIP1193 provider
      // This will be used as the signer for the user's smart account
      const privyClient = createWalletClient({
        account: getAddress(embeddedWallet.address),
        chain,
        transport: custom(provider),
      });

      const customSigner = walletClientToCustomSigner(privyClient);

      // Create a viem public client for RPC calls
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      // Initialize the smart account for the user
      const simpleSmartAccount = await signerToSimpleSmartAccount(
        publicClient,
        {
          entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
          signer: customSigner,
          factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454",
        }
      );

      // Create the Paymaster for gas sponsorship using the API key from your Pimlico dashboard
      const pimlicoPaymaster = createPimlicoPaymasterClient({
        transport: http(
          "https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY"
        ),
      });

      // Create the SmartAccountClient for requesting signatures and transactions (RPCs)
      const smartAccountClient = createSmartAccountClient({
        account: simpleSmartAccount,
        chain,
        transport: http(
          "https://api.pimlico.io/v1/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY"
        ),
        sponsorUserOperation: pimlicoPaymaster.sponsorUserOperation, // If your app uses a paymaster for gas sponsorship
      });
    },
  });

  if (!isPending) return <div>Loading...</div>;

  return <div>Create Organization</div>;
}
