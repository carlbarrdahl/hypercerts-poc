// import { privy } from "@/lib/privy";
// import { authed } from "@/orpc";
// import { os } from "@orpc/server";
// import { z } from "zod";

// const OrganizationSchema = z.object({
//   name: z.string(),
//   description: z.string().optional(),
// });
// const FilterSchema = z.object({
//   limit: z.number().int().min(1).max(100).optional(),
//   cursor: z.number().int().min(0).default(0),
// });

// export const create = authed
//   .input(OrganizationSchema)
//   .handler(async ({ input, context }) => {
//     console.log(input, context);
//     return [{ id: 1, name: "name" }];
//   });

// export const list = authed
//   .input(FilterSchema)
//   .handler(async ({ input, context }) => {
//     console.log(input, context);
//     const wallets = [];
//     let nextCursor;

//     do {
//       const result = await privy.walletApi.getWallets({
//         chainType: "ethereum",
//         cursor: nextCursor,
//       });
//       wallets.push(...result.data);
//       nextCursor = result.nextCursor;
//     } while (nextCursor);

//     return wallets;
//   });
