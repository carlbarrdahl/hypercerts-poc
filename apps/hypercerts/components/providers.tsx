"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/components/sonner";
import { HypercertsProvider } from "@workspace/sdk";

import {
  AlchemyAccountProvider,
  AlchemyAccountsProviderProps,
  useSmartAccountClient,
} from "@account-kit/react";
import { baseSepolia } from "@account-kit/infra";
import { config } from "@/config";
import { useWalletClient } from "wagmi";

export function Providers({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: AlchemyAccountsProviderProps["initialState"];
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider
        config={config}
        queryClient={queryClient}
        initialState={initialState}
      >
        {/* <Hypercerts> */}
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
          <Toaster />
        </NextThemesProvider>
        {/* </Hypercerts> */}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
}

function Hypercerts({ children }: { children: React.ReactNode }) {
  // const { data: client } = useSmartAccountClient();
  const { data: client } = useWalletClient();
  if (!client) return <div>Loading...</div>;
  return <HypercertsProvider client={client}>{children}</HypercertsProvider>;
}
