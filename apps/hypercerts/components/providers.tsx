"use client";

import * as React from "react";
import { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/components/sonner";
import { HypercertsProvider } from "@workspace/sdk";

import { config } from "@/config";
import { useWalletClient, WagmiProvider } from "wagmi";

export function Providers({ children }: { children: React.ReactNode }) {
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
  );
}

function Hypercerts({ children }: PropsWithChildren) {
  const { data: client } = useWalletClient();
  if (!client) return <div>Loading...</div>;
  return <HypercertsProvider client={client}>{children}</HypercertsProvider>;
}
