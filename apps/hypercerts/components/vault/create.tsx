"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { HyperVaultConfig, useHypercerts } from "@workspace/sdk";
import { Button } from "@workspace/ui/components/button";


import deployments from "@/contracts/deployments.json";
export function CreateVault() {
  const { sdk } = useHypercerts();
  console.log(sdk);
  const create = useMutation({
    mutationFn: async (config: HyperVaultConfig) => await sdk?.vault.create(config),
  });

  console.log(create.data, create.error)
  return (
    <div>
      <h3>Create Vault</h3>

      <Button onClick={() => create.mutate({
        asset: sdk?.test?.token!,
        percent: 10000n,
        metadata: "test",
      })}>Create Vault</Button>
    </div>
  );
}
