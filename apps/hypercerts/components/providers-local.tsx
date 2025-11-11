"use client";
import { PropsWithChildren } from "react";

import { createConfig, http, useWalletClient, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { burner } from "burner-connector";
import { HypercertsProvider } from "@workspace/sdk";
import { hardhat } from "viem/chains";
import { baseSepolia } from "@account-kit/infra";

const defaultChain = hardhat;
const config = createConfig({
  chains: [defaultChain],
  connectors: [burner()],
  transports: {
    [defaultChain.id]: http(),
  },
  autoConnect: false,
});

export function Providers({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Hypercerts>{children}</Hypercerts>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function Hypercerts({ children }: PropsWithChildren) {
  const { data: client } = useWalletClient();

  if (!client) return <>{children}</>;

  return <HypercertsProvider client={client}>{children}</HypercertsProvider>;
}
