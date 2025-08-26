"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { HypercertsProvider } from "@workspace/sdk";
import { baseSepolia } from "wagmi/chains";

const config = createConfig(
  getDefaultConfig({
    appName: "ConnectKit Next.js demo",
    chains: [baseSepolia],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <HypercertsProvider>{children}</HypercertsProvider>
          </NextThemesProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
