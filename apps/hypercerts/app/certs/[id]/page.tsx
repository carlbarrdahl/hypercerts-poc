"use client";

import { use } from "react";
import { VaultDetails } from "@/components/vault/details";
import { ContributorsList } from "@/components/vault/contributors";
import { Address } from "viem";
import { FundersList } from "@/components/vault/funders";
import { Attestations } from "@/components/vault/attestations";
import { MilestoneTimeline } from "@/components/milestone/milestone-timeline";
import { useQuery } from "@tanstack/react-query";
import {
  useHypercerts,
  useListHypercerts,
  calculateVaultLevel,
} from "@workspace/sdk";
import { useAccount } from "wagmi";
import { AttestationGraph } from "@/components/vault/attestation-graph";

export default function CertPage({
  params,
}: {
  params: Promise<{ id: Address }>;
}) {
  const { id } = use(params);
  const { sdk } = useHypercerts();
  const { data: allVaults } = useListHypercerts({});
  const { address } = useAccount();

  // Determine if this is a project
  const { data: vault } = useQuery({
    queryKey: ["vault", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items[0],
  });

  const { data: parentVault } = useQuery({
    queryKey: ["vault", "parent", vault?.parent],
    queryFn: () =>
      vault?.parent
        ? (sdk?.vault.query({ where: { id: vault.parent }, limit: 1 }) ?? null)
        : null,
    select: (data) => data?.items[0],
    enabled: Boolean(vault?.parent),
  });

  const isProject =
    vault &&
    (calculateVaultLevel(vault, parentVault) > 2 ||
      vault.metadata?.vaultType === "project" ||
      vault.metadata?.pathwaySlug);
  const isProjectOwner = address && vault?.owner === address;

  return (
    <div className="min-h-screen bg-background">
      <VaultDetails id={id} />

      <div className=" px-8 py-12">
        {/* Show milestones timeline for projects */}
        {isProject ? (
          <>
            <div className="mt-12 pt-8 border-t border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ContributorsList id={id} />
                <FundersList id={id} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ContributorsList id={id} />
              <FundersList id={id} />
            </div>
            <Attestations id={id} />

            <AttestationGraph id={id} />
          </>
        )}
      </div>
    </div>
  );
}
