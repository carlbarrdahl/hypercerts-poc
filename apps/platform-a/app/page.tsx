"use client";

import { Button } from "@workspace/ui/components/button";
import { useHypercerts } from "@workspace/sdk";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ accessToken: string }>;
}) {
  const { accessToken } = await searchParams;

  console.log("accessToken", accessToken);
  return (
    <div>
      <div className="flex justify-center pt-24">
        <LinkAccount accessToken={accessToken} />
      </div>
    </div>
  );
}

function LinkAccount({ accessToken }: { accessToken?: string }) {
  const { address } = useAccount();
  const { sdk } = useHypercerts();

  const { data, isPending } = useQuery({
    queryKey: ["account", address],
    queryFn: () => sdk?.account.get(address!),
    enabled: !!address,
  });

  useEffect(() => {
    if (accessToken) {
      sdk?.account.setAccessToken(accessToken);
    }
  }, [accessToken]);

  console.log("data", data, address, isPending);
  if (isPending) return <div>Loading...</div>;
  if (!address) return <div>Connect your wallet</div>;

  if (data) {
    return (
      <div>
        Account linked
        <pre>{data.id}</pre>
      </div>
    );
  }

  return (
    <div>
      <Button
        onClick={async () => {
          const link = await sdk?.account.link({
            address,
            redirectUrl: window.location.href,
          });
          console.log(link);
          window.open(link, "_blank");
        }}
      >
        Link Hypercerts Account
      </Button>
    </div>
  );
}

function Organization() {
  const { sdk } = useHypercerts();
  const { data, isPending } = useQuery({
    queryKey: ["organization"],
    queryFn: () => sdk?.organization.list(),
  });

  if (isPending) return <div>Loading...</div>;
  if (!data) return <div>No organization found</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
