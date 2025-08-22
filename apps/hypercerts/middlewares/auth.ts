import { privy } from "@/lib/privy";
import { os } from "@orpc/server";

import { ORPCError } from "@orpc/server";
import { cookies } from "next/headers";

async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("privy-token")?.value;
  if (!accessToken) {
    throw new ORPCError("UNAUTHORIZED");
  }
  const verifiedClaims = await privy.verifyAuthToken(accessToken as string);
  if (!verifiedClaims) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return { ...verifiedClaims, accessToken };
}

export const requiredAuthMiddleware = os
  .$context<{ session?: { userId?: string; accessToken?: string } }>()
  .middleware(async ({ context, next }) => {
    /**
     * Why we should ?? here?
     * Because it can avoid `getSession` being called when unnecessary.
     * {@link https://orpc.unnoq.com/docs/best-practices/dedupe-middleware}
     */
    const session = context.session ?? (await getSession());
    console.log("Session", session);
    if (!session.userId) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({ context: { session } });
  });
