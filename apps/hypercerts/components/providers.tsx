"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "./privy-provider";
import { Toaster } from "@workspace/ui/components/sonner";
import { baseSepolia } from "viem/chains";
import { HypercertsProvider } from "@workspace/sdk";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <PrivyProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <QueryClientProvider client={queryClient}>
          <HypercertsProvider chainId={baseSepolia.id}>
            {children}
          </HypercertsProvider>
          <Toaster />
        </QueryClientProvider>
      </NextThemesProvider>
    </PrivyProvider>
  );
}
