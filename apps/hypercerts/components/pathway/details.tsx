"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useHypercerts,
  useListContributors,
  useListFunders,
} from "@workspace/sdk";
import { useState } from "react";
import { Address, parseUnits, formatUnits } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useAccount } from "wagmi";
import { BannerImage } from "../banner-image";
import Link from "next/link";
import {
  Globe,
  Leaf,
  Loader2,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { ContributorsTreemap } from "../vault/contributors-treemap";
import { Map } from "../map";
import { useFetchKML } from "@/hooks/use-fetch-kml";
import { ContributorsList } from "../vault/contributors";
import { FundersList } from "../vault/funders";
import { Page } from "@/components/page";
import { FundingCard } from "../vault/funding-card";
import { DistributeCard } from "../vault/distribute-card";
import { FundedProjectsList } from "../vault/funded-projects";
import { FundingStats } from "../vault/funding-stats";
import { Markdown } from "../markdown";

export function PathwayDetails({ id }: { id: Address }) {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { sdk } = useHypercerts();

  const {
    data: vault,
    error: vaultError,
    isLoading: isLoadingVault,
  } = useQuery({
    queryKey: ["pathway", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items[0],
    refetchInterval: 1000,
  });

  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["pathway", id, "balance"],
    queryFn: () => sdk?.vault.balance(id) ?? null,
    enabled: Boolean(id),
    refetchInterval: 1000,
  });

  const { data: creatorData } = useListContributors(
    {
      where: {
        vault: id,
        address: vault?.owner,
      },
    },
    {
      refetchInterval: 1000,
    }
  );
  const creator = creatorData?.items?.[0];

  const [amount, setAmount] = useState<number | null>(null);

  const onSuccess = async () => {
    setTimeout(() => queryClient.invalidateQueries({ queryKey: [] }), 200);
  };

  const deposit = useMutation({
    mutationFn: async (wei: bigint) => sdk?.vault.deposit(id, wei),
    onSuccess: () => {
      onSuccess();
      toast.success("Contribution successful!");
    },
    onError: (error) => {
      toast.error("Contribution failed", {
        description: error.message,
      });
    },
  });

  const withdraw = useMutation({
    mutationFn: async (wei: bigint) => sdk?.vault.withdraw(id, wei),
    onSuccess: () => {
      onSuccess();
      toast.success("Withdrawal successful!");
    },
    onError: (error) => {
      toast.error("Withdrawal failed", {
        description: error.message,
      });
    },
  });

  const fund = useMutation({
    mutationFn: async (wei: bigint) => sdk?.vault.fund(id, wei, true),
    onSuccess: () => {
      onSuccess();
      toast.success("Funding successful!");
    },
    onError: (error) => {
      toast.error("Funding failed", {
        description: error.message,
      });
    },
  });

  const amountInWei = parseUnits(
    String(amount ?? 0),
    vault?.token?.decimals || 18
  );

  const metadata = vault?.metadata as Record<string, any> | undefined;
  const regionName = metadata?.title || "Region";
  const description = metadata?.description || "";
  const image = metadata?.image;
  const iconicSpecies = metadata?.iconicSpecies;
  const regionId = metadata?.regionId;

  const isLoading = isLoadingVault || isLoadingBalance;
  console.log({ amountInWei });
  if (vaultError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                Error Loading Region
              </CardTitle>
              <CardDescription>
                Unable to load region details. Please try again later.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading region...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <BannerImage src={image} alt={regionName} />
        <h1 className="text-4xl mt-4 md:text-5xl font-semibold tracking-tight">
          {regionName}
        </h1>

        <Markdown className="prose-xl">{description}</Markdown>
      </div>

      <FundingStats id={id} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Funded Projects Section */}
          <FundedProjectsList id={id} />

          {/* Contributors Treemap */}
          <ContributorsTreemap id={id} />
        </div>

        {/* Right Column - Actions & Stats (Sticky Sidebar) */}
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Actions Card */}
            <FundingCard
              amount={amount}
              setAmount={setAmount}
              amountInWei={amountInWei}
              onFund={() => {
                fund.mutate(amountInWei);
                setAmount(null);
              }}
              isLoading={fund.isPending}
              tokenSymbol={vault?.token?.symbol}
              tokenAddress={vault?.token?.address!}
              spenderAddress={id!}
              variant="enhanced"
              title="Take Action"
              description="Support this pathway by funding"
              helpText="provides direct support without receiving shares, helping to amplify impact across the pathway."
              buttonText="Fund This Pathway"
            />

            {/* Distribute Funds Card - Only for owners */}
            {address && vault?.owner === address.toLowerCase() && (
              <DistributeCard
                vaultId={id}
                // variant="enhanced"
                description="Allocate resources to project vaults"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
