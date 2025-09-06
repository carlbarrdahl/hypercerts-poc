"use client";
import { PropsWithChildren } from "react";

import { createConfig, http, useWalletClient, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { burner } from "burner-connector";
import { HypercertsProvider } from "@workspace/sdk";
import { hardhat } from "viem/chains";

const config = createConfig({
  chains: [hardhat],
  connectors: [burner()],
  transports: {
    [hardhat.id]: http(),
  },
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
  const { data } = useWalletClient();
  if (!data) return <div>Loading...</div>;
  return <HypercertsProvider client={data}>{children}</HypercertsProvider>;
}
