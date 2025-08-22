import { authed, pub } from "@/orpc";
// import * as organization from "./organization";
import { z } from "zod";
import { privy } from "@/lib/privy";
import { ORPCError } from "@orpc/server";

const AccountSchema = z.object({});
const OrganizationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});
const FilterSchema = z
  .object({
    limit: z.number().int().min(1).max(100).optional(),
    cursor: z.number().int().min(0).default(0),
  })
  .optional();

const account = {
  link: authed
    .input(
      z.object({
        address: z.string(),
      })
    )
    .handler(async ({ input: { address }, context }) => {
      const userId = context?.session?.userId!;
      console.log("Linking wallet", userId, address);

      const user = await privy.getUserById(userId);

      const wallet =
        (await privy.getUserByWalletAddress(address)) ||
        (await privy.walletApi.createWallet({
          chainType: "ethereum",
          owner: { userId },
          // additionalSigners: [{ signerId: userId }],
        }));

      if (!wallet) {
        throw new ORPCError("NOT_FOUND", {
          message: "Wallet not found",
        });
      }

      console.log(user, wallet);
      // await privy.walletApi.updateWallet({
      //   id: userId,
      //   additionalSigners: [
      //     {
      //       signerId: address,
      //       overridePolicyIds: ["default"],
      //     },
      //   ],
      // });
      return {};
      // return privy.walletApi.createWallet({
      //   chainType: "ethereum",
      //   owner: { userId },
      // });
    }),

  get: pub
    .input(
      z.object({
        address: z.string(),
      })
    )
    .handler(async ({ input }) => privy.getUserByWalletAddress(input.address)),
};

const certs = {
  create: authed
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      // const userId = context?.session?.userId!;
      // const { authorizationKey } = await privy.walletApi.generateUserSigner({
      //   userJwt: context?.session?.accessToken!,
      // });
      // console.log(authorizationKey);
      // return privy.walletApi.createWallet({
      //   chainType: "ethereum",
      //   owner: { userId },
      //   authorizationKeyIds: [authorizationKey.id],
      //   authorizationThreshold: 1,
      // });
    }),
};

const organization = {
  create: authed
    .input(
      z.object({
        authorizationKeyIds: z.string().array(),
        authorizationThreshold: z.number().int().min(1).max(100).optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const userId = context?.session?.userId!;
      return privy.createWallets({
        userId,
        wallets: [
          {
            chainType: "ethereum",
            createSmartWallet: true,
            policyIds: ["default"],
          },
        ],
      });
      // return privy.walletApi.createWallet({
      //   chainType: "ethereum",
      //   owner: { userId },
      //   authorizationKeyIds: input.authorizationKeyIds,
      //   authorizationThreshold: input.authorizationThreshold,
      // });
    }),
  get: authed
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const userId = context?.session?.userId!;
      const wallet = await privy.walletApi.getWallet({ id: input.id });
      return wallet;
    }),
  update: authed
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      console.log(input);
      // TODO: check if the user owns the wallet
      const userId = context?.session?.userId!;
      return privy
        .setCustomMetadata(input.id, {
          name: input.name,
          description: input.description ?? "",
        })
        .catch((e) => {
          console.error(e);
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to update organization",
          });
        });
    }),
  updateMembers: authed
    .input(
      z.object({
        id: z.string(),
        method: z.enum(["add", "remove"]),
        address: z.string(),
        role: z.enum(["admin", "member"]),
      })
    )
    .handler(async ({ input, context }) => {
      console.log(input);
      const userId = context?.session?.userId!;
      // if (input.method === "add") {
      //   await privy.walletApi.updateWallet({
      //     id: userId,
      //     additionalSigners: [
      //       {
      //         signerId: input.address,
      //       },
      //     ],
      //   });
      // } else {
      //   console.log("remove");
      //   throw new ORPCError("NOT_IMPLEMENTED", {
      //     message: "Remove member not implemented",
      //   });
      //   // await privy.walletApi.updateWallet({
      //   //   id: userId,
      //   //   additionalSigners: [
      //   //     {
      //   //       signerId: input.address,
      //   //     },
      //   //   ],
      //   // });
      // }
    }),
  list: authed.input(FilterSchema).handler(async ({ input, context }) => {
    console.log(input, context);

    // const { authorizationKey } = await privy.walletApi.generateUserSigner({
    //   userJwt: context?.session?.accessToken!,
    // });
    // console.log({ authorizationKey });
    const wallets = [];
    let nextCursor;

    do {
      const result = await privy.walletApi.getWallets({
        chainType: "ethereum",
        cursor: nextCursor,
      });
      wallets.push(...result.data);
      nextCursor = result.nextCursor;
    } while (nextCursor);

    
    return wallets;
  }),
};

export const router = {
  account,
  organization,
};
