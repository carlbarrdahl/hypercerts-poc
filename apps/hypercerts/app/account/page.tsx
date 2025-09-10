"use client";

import { useHypercerts } from "@workspace/sdk";
import { useEffect } from "react";
import { useAccount } from "wagmi";
export default function AccountPage() {
  const { sdk } = useHypercerts();
  console.log("sdk", sdk);

  useEffect(() => {
    sdk?.account.get().then((account) => {
      console.log("account", account);
    });
  }, [sdk]);
  return (
    <div>
      <h1>Account</h1>
    </div>
  );
}
