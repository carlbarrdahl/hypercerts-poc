"use client";

import { orpc } from "@/lib/orpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { Address } from "viem";
import { useRouter } from "next/navigation";
import { useLinkAccount, usePrivy, useWallets } from "@privy-io/react-auth";
import Link from "next/link";

export default async function LinkPage({
  searchParams,
}: {
  searchParams: Promise<{ address: Address; redirectUrl: string }>;
}) {
  const { address, redirectUrl } = await searchParams;

  return (
    <div className="w-96 border p-4 mx-auto">
      <h3 className="text-lg font-bold">Link account</h3>
      <div className="py-4">
        Procceed to link this address:{" "}
        <code className="text-sm bg-background text-foreground rounded-md p-1 block">
          {address}
        </code>
      </div>

      <LinkAccount address={address} redirectUrl={redirectUrl} />
    </div>
  );
}

function LinkAccount({
  address,
  redirectUrl,
}: {
  address: Address;
  redirectUrl: string;
}) {
  const router = useRouter();
  const { ready, getAccessToken, ...rest } = usePrivy();

  console.log(rest);

  const { wallets } = useWallets();
  console.log(wallets);
  const { linkWallet } = useLinkAccount({
    onSuccess: async () => {
      toast.success("Account linked successfully");
      router.push(redirectUrl + "?status=success");
    },
    onError(error) {
      toast.error(error);
    },
  });

  if (!ready) {
    return (
      <div className="p-4 flex items-center justify-center">Loading...</div>
    );
  }

  // const isLinked = wallets.some((wallet) => wallet.address === address);
  const isLinked = false;

  const button = isLinked ? (
    <Button className="w-full" variant="ghost" disabled>
      Account already linked
    </Button>
  ) : (
    <Button
      className="w-full"
      onClick={() => linkWallet({})}
      // onClick={() => mutate({ address })}
      // isLoading={isPending}
      loadingText="Linking..."
    >
      Link Account
    </Button>
  );

  return (
    <div>
      {button}
      <Link href={redirectUrl}>
        <Button className="w-full" variant={"ghost"}>
          Back
        </Button>
      </Link>
    </div>
  );
}
