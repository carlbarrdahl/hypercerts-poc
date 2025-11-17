"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useHypercerts,
  useListContributors,
  useListFunders,
  useListHypercerts,
} from "@workspace/sdk";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";
import { Address, parseUnits, formatUnits } from "viem";
import { AllowanceCheck } from "../allowance-check";
import { TokenAmount } from "../token-amount";
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
  ArrowLeft,
  Globe,
  MapPin,
  Leaf,
  Loader2,
  ArrowRightLeft,
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
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@workspace/ui/components/item";

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

  // Fetch funded projects (child vaults)
  const { data: fundedProjects, isLoading: isLoadingProjects } =
    useListHypercerts(
      {
        where: { parent: id },
      },
      {
        refetchInterval: 1000,
      }
    );

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
    <Page title={"Back to regions"} backLink="/regions">
      {/* Hero Section with Image */}
      {image && (
        <div className="relative h-96 overflow-hidden border-b border-border -mx-8">
          <BannerImage src={image} alt={regionName} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-foreground/10 backdrop-blur-sm rounded-lg">
                  <Globe className="w-6 h-6" />
                </div>
                {iconicSpecies && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-foreground/10 backdrop-blur-sm rounded-full text-sm">
                    <Leaf className="w-4 h-4" />
                    <span>{iconicSpecies}</span>
                  </div>
                )}
                {regionId && (
                  <div className="px-3 py-1 bg-foreground/10 backdrop-blur-sm rounded-full text-sm font-mono">
                    {regionId}
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                {regionName}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Assets
                </p>
                <p className="text-lg font-bold">
                  {formatUnits(
                    balance?.assets ?? 0n,
                    vault?.token?.decimals || 18
                  )}{" "}
                  {vault?.token?.symbol}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Shares
                </p>
                <p className="text-lg font-bold">
                  {formatUnits(
                    balance?.shares ?? 0n,
                    vault?.token?.decimals || 18
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Price per Share
                </p>
                <p className="text-lg font-bold">
                  {balance?.price.toString() || "0"} {vault?.token?.symbol}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Funded Projects
                </p>
                <p className="text-lg font-bold">
                  {fundedProjects?.items?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {description && (
            <Card className="border-2 border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  About This Pathway
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Funded Projects Section */}
          {fundedProjects &&
            fundedProjects.items &&
            fundedProjects.items.length > 0 && (
              <Card className="border-2 border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Funded Projects
                  </CardTitle>
                  <CardDescription>
                    Projects receiving funding from this pathway
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {fundedProjects.items.map((project) => {
                    const projectMeta = project.metadata as
                      | Record<string, any>
                      | undefined;
                    return (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="block"
                      >
                        <Item
                          variant="outline"
                          className="hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                        >
                          {projectMeta?.image && (
                            <ItemMedia variant="image">
                              <BannerImage
                                src={projectMeta.image}
                                alt={projectMeta?.title || "Project"}
                              />
                            </ItemMedia>
                          )}
                          <ItemContent>
                            <ItemTitle className="text-base font-semibold">
                              {projectMeta?.title || "Untitled Project"}
                            </ItemTitle>
                            <ItemDescription className="line-clamp-2">
                              {projectMeta?.description ||
                                "No description available"}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <div className="text-xs text-muted-foreground">
                              View details →
                            </div>
                          </ItemActions>
                        </Item>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}

          {/* Contributors Treemap */}
          <ContributorsTreemap id={id} />

          {/* Contributors & Funders */}
          <div className="space-y-6">
            <ContributorsList id={id} />
            <FundersList id={id} />
          </div>
        </div>

        {/* Right Column - Actions & Stats (Sticky Sidebar) */}
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Actions Card */}
            <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  Take Action
                </CardTitle>
                <CardDescription>
                  Support this pathway by funding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                  <label className="text-xs font-medium text-muted-foreground block mb-2">
                    Amount to fund
                  </label>
                  <Input
                    type="number"
                    value={amount ?? ""}
                    placeholder={`0.00 ${vault?.token?.symbol || "tokens"}`}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    disabled={
                      deposit.isPending || withdraw.isPending || fund.isPending
                    }
                    className="text-lg font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <AllowanceCheck
                    tokenAddress={vault?.token?.address!}
                    amount={amountInWei}
                    spender={id!}
                  >
                    <Button
                      onClick={() => {
                        fund.mutate(amountInWei);
                        setAmount(null);
                      }}
                      disabled={!amount || amount <= 0 || fund.isPending}
                      className="w-full h-11 font-semibold"
                      isLoading={fund.isPending}
                      loadingText="Funding..."
                    >
                      Fund This Pathway
                    </Button>
                  </AllowanceCheck>
                </div>

                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">
                      💡 Funding
                    </span>{" "}
                    provides direct support without receiving shares, helping to
                    amplify impact across the pathway.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Distribute Funds Card - Only for owners */}
            {address && vault?.owner === address.toLowerCase() && (
              <Card className="border-2 border-purple-500/30 shadow-lg bg-gradient-to-br from-purple-500/5 to-purple-500/10">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-purple-600" />
                    Distribute Funds
                  </CardTitle>
                  <CardDescription>
                    Allocate resources to project vaults
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/distribute/${id}`}>
                    <Button
                      variant="default"
                      className="w-full h-11 font-semibold"
                    >
                      Open Distribution Flow
                    </Button>
                  </Link>
                  <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      As the pathway owner, you can distribute funds to multiple
                      project vaults using an interactive flow interface.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
