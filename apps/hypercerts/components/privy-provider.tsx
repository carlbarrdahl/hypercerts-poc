"use client";

import { PrivyProvider as PrivyProviderComponent } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { baseSepolia } from "viem/chains";

interface PrivyProviderProps {
  children: ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  return (
    <PrivyProviderComponent
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        defaultChain: baseSepolia,
        loginMethods: ["email", "wallet", "google", "github"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          // showWalletUIs: false,
        },
      }}
    >
      {children}
    </PrivyProviderComponent>
  );
}
