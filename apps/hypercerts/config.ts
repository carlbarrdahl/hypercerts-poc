// @noErrors
// import { createConfig, cookieStorage } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";
// import { baseSepolia, alchemy } from "@account-kit/infra";
import { burner } from "burner-connector";
// export const config = createConfig(
//   {
//     transport: alchemy({
//       // Replace with your API key
//       apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
//     }),
//     chain: baseSepolia,
//     ssr: true,
//     storage: cookieStorage,
//     enablePopupOauth: true,
//     // For gas sponsorship (optional)
//     // Learn more here: https://www.alchemy.com/docs/wallets/transactions/sponsor-gas/sponsor-gas-evm
//     policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID!,
//   },
//   {
//     auth: {
//       sections: [
//         [{ type: "email" }],
//         [
//           { type: "passkey" },
//           { type: "social", authProviderId: "google", mode: "popup" },
//         ],
//       ],
//       addPasskeyOnSignup: false,
//     },
//   }
// );

import { createConfig, http } from "wagmi";
import { baseSepolia, hardhat } from "wagmi/chains";

export const config = createConfig({
  chains: [hardhat, baseSepolia],
  connectors: [burner()],
  transports: {
    [hardhat.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export const queryClient = new QueryClient();
