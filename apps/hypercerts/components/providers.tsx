"use client";

import * as React from "react";
import { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/components/sonner";
import { HypercertsProvider } from "@workspace/sdk";
import { PrivyProvider } from "@privy-io/react-auth";
// import { config } from "@/config";
import { http, useWalletClient } from "wagmi";
import { createConfig } from "@privy-io/wagmi";
import { baseSepolia, hardhat } from "viem/chains";
import { WagmiProvider } from "@privy-io/wagmi";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const isServer = typeof window === "undefined";

export const config = createConfig({
  chains: [hardhat, baseSepolia], // Pass your required chains as an array
  transports: {
    [hardhat.id]: http(),
    [baseSepolia.id]: http(),
  },
});
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => getQueryClient());

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        defaultChain: hardhat,
        supportedChains: [hardhat],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        loginMethods: ["email", "wallet", "google", "github"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <Hypercerts>
              {children}
              <Toaster />
            </Hypercerts>
          </NextThemesProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

function Hypercerts({ children }: PropsWithChildren) {
  const { data: client } = useWalletClient();
  if (!client) return <>{children}</>;
  return <HypercertsProvider client={client}>{children}</HypercertsProvider>;
}
