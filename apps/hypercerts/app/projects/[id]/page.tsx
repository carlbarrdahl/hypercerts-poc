"use client";

import { use } from "react";
import { Address } from "viem";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useHypercerts,
  useListHypercerts,
  calculateVaultLevel,
  useListContributors,
} from "@workspace/sdk";
import { useAccount } from "wagmi";
import Link from "next/link";
import {
  ArrowLeft,
  ImageIcon,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  ExternalLink,
  Share2,
  Loader2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { toast } from "sonner";
import { useState } from "react";
import { parseUnits } from "viem";

// Import existing components
import { ContributorsList } from "@/components/vault/contributors";
import { FundersList } from "@/components/vault/funders";
import { Attestations } from "@/components/vault/attestations";
import { AttestationGraph } from "@/components/vault/attestation-graph";
import { ContributorsTreemap } from "@/components/vault/contributors-treemap";
import { TokenAmount, Amount } from "@/components/token-amount";
import { AllowanceCheck } from "@/components/allowance-check";
import { PathwaySelector } from "@/components/pathway-selector";
import { oneEarthFramework } from "@/lib/pathway-data";
import { findPathwayBySlug } from "@/lib/pathway-utils";
import { Input } from "@workspace/ui/components/input";
import { Markdown } from "@/components/markdown";
import { Map } from "@/components/map";
import { useFetchKML } from "@/hooks/use-fetch-kml";

export default function CertPage({
  params,
}: {
  params: Promise<{ id: Address }>;
}) {
  const { id } = use(params);
  const { sdk } = useHypercerts();
  const { data: allVaults } = useListHypercerts({});
  const { address } = useAccount();
  const queryClient = useQueryClient();

  // Fetch vault data
  const { data: vault } = useQuery({
    queryKey: ["vault", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items?.[0],
    refetchInterval: 1000,
  });

  const { data: balance } = useQuery({
    queryKey: ["vault", id, "balance"],
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

  const { data: parentVault } = useQuery({
    queryKey: ["vault", "parent", vault?.parent],
    queryFn: () =>
      vault?.parent
        ? (sdk?.vault.query({ where: { id: vault.parent }, limit: 1 }) ?? null)
        : null,
    select: (data) => data?.items?.[0],
    enabled: Boolean(vault?.parent),
    refetchInterval: 1000,
  });

  const { data: childrenVaults } = useQuery({
    queryKey: ["vault", "children", id],
    queryFn: () =>
      sdk?.vault.query({ where: { parent: id as Address } }) ?? null,
    select: (data) => data?.items || [],
    enabled: Boolean(id),
    refetchInterval: 1000,
  });

  const isProject =
    vault &&
    (calculateVaultLevel(vault, parentVault) > 2 ||
      vault.metadata?.vaultType === "project" ||
      vault.metadata?.type === "project");
  const isProjectOwner = address && vault?.owner === address;

  // Fetch GeoJSON for map
  const geoJSONUrl = vault?.metadata?.geoJSON as string | undefined;
  const geoJSON = JSON.parse(geoJSONUrl ?? "null");
  console.log(geoJSON, vault?.metadata);
  // Get pathway data - metadata.pathway contains the pathway name
  const pathwayName = vault?.metadata?.pathway as string | undefined;
  const pathwayData = pathwayName
    ? findPathwayBySlug(oneEarthFramework, pathwayName)
    : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vault?.metadata?.title || "Project",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };
  console.log(balance);
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {/* Banner Image */}
        <div className="w-full h-[400px] bg-muted relative overflow-hidden">
          {vault?.metadata?.image ? (
            <img
              src={`${vault.metadata.image}?auto=compress%2Cformat&w=1920`}
              alt={vault?.metadata?.title || "Project"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-24 h-24 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-32">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors mb-6 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {vault?.metadata?.pathway && (
                      <Badge variant="secondary" className="text-xs">
                        {vault.metadata.pathway}
                      </Badge>
                    )}
                    {isProject && (
                      <Badge variant="outline" className="text-xs">
                        Project
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    {vault?.metadata?.title || "Untitled Project"}
                  </h1>

                  <Markdown>
                    {vault?.metadata?.description ||
                      "No description available."}
                  </Markdown>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {vault?.metadata?.region && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {vault.metadata.region}
                      </div>
                    )}
                    {vault?.metadata?.budget && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />$
                        {vault.metadata.budget.toLocaleString()} Budget
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  {isProjectOwner && (
                    <Link href={`/certs/${id}/edit`}>
                      <Button variant="outline">Edit Project</Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Total Assets
                  </div>
                  <div className="text-lg font-semibold">
                    <TokenAmount
                      amount={balance?.assets}
                      token={vault?.token?.address!}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Total Shares
                  </div>
                  <div className="text-lg font-semibold">
                    <TokenAmount
                      amount={balance?.shares}
                      token={vault?.token?.address!}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Price/Share
                  </div>
                  <div className="text-lg font-semibold">
                    <Amount
                      amount={balance?.price}
                      symbol={vault?.token?.symbol}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Owner
                  </div>
                  <div className="text-sm font-mono truncate">
                    {vault?.owner?.slice(0, 6)}...{vault?.owner?.slice(-4)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attestations">
              Milestones & Attestations
            </TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Map */}
            {geoJSONUrl &&
              (geoJSON ? (
                <div className="overflow-hidden rounded-lg border border-border">
                  <Map zoom={8} geoJson={geoJSON} height={400} />
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-muted rounded-lg border border-border">
                  <p className="text-muted-foreground">Map data unavailable</p>
                </div>
              ))}

            {/* Linked Pathway */}
            {pathwayData && (
              <Card>
                <CardHeader>
                  <CardTitle>Linked Solution Pathway</CardTitle>
                  <CardDescription>
                    This project contributes to the following climate solution
                    pathway
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {pathwayData.pillar.name} / {pathwayData.subPillar.name}
                    </div>
                    <h3 className="font-semibold text-lg">
                      {pathwayData.pathway.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pathwayData.pathway.summary}
                    </p>
                    <Link
                      href={`/solutions/${pathwayName}`}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      View Pathway Details
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pathway Linking (Owner Only) */}
            {isProjectOwner && !pathwayData && (
              <Card>
                <CardHeader>
                  <CardTitle>Link to Solution Pathway</CardTitle>
                  <CardDescription>
                    Connect this project to a solution pathway from the OneEarth
                    Solutions Framework
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PathwaySelector
                    onSelect={(slug) => {
                      toast.info(
                        "Pathway linking will be saved when metadata update is implemented"
                      );
                    }}
                    currentPathwaySlug={pathwayName}
                  />
                </CardContent>
              </Card>
            )}

            {/* Contributors Treemap */}
            <ContributorsTreemap id={id} />
          </TabsContent>

          {/* Attestations Tab */}
          <TabsContent value="attestations" className="space-y-6">
            <Attestations id={id} />
            <AttestationGraph id={id} />
          </TabsContent>

          {/* Funding Tab */}
          <TabsContent value="funding" className="space-y-6">
            <FundingSection
              id={id}
              vault={vault}
              balance={balance}
              creator={creator}
            />
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContributorsList id={id} />
              <FundersList id={id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FundingSection({ id, vault, balance, creator }: any) {
  const { address } = useAccount();
  const { sdk } = useHypercerts();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number | null>(null);

  const amountInWei = parseUnits(
    String(amount ?? 0),
    vault?.token?.decimals ?? 18
  );

  // Preview how many shares the deposit will mint
  const { data: previewShares } = useQuery({
    queryKey: ["previewDeposit", id, amountInWei.toString()],
    queryFn: () => sdk?.vault.previewDeposit(id, amountInWei) ?? null,
    enabled: Boolean(sdk && id && amountInWei > 0n),
  });

  console.log("previewShares", previewShares);
  const onSuccess = async () => {
    setTimeout(() => queryClient.invalidateQueries({ queryKey: [] }), 200);
    setAmount(null);
  };

  const deposit = useMutation({
    mutationFn: async (wei: bigint) => sdk?.vault.deposit(id, wei),
    onSuccess,
  });

  const fund = useMutation({
    mutationFn: async (wei: bigint) => sdk?.vault.fund(id, wei, true),
    onSuccess,
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Funding Details</CardTitle>
          <CardDescription>
            Overview of project funding and shares
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Total Assets</span>
            <TokenAmount
              amount={balance?.assets}
              token={vault?.token?.address!}
            />
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Total Shares</span>
            <TokenAmount
              amount={balance?.shares}
              token={vault?.token?.address!}
            />
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm text-muted-foreground">
              Price per Share
            </span>
            <span className="font-medium">
              <Amount amount={balance?.price} symbol={vault?.token?.symbol} />
            </span>
          </div>
          <div className="pt-3">
            <h4 className="text-sm font-semibold mb-3">Creator Shares</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Assets</span>
                <Amount amount={creator?.assets} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Shares</span>
                <Amount amount={creator?.shares} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {address && (
        <Card>
          <CardHeader>
            <CardTitle>Support This Project</CardTitle>
            <CardDescription>
              Deposit or fund to support this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Amount ({vault?.token?.symbol})
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount ?? ""}
                onChange={(e) => setAmount(Number(e.target.value) || null)}
              />
              {previewShares && previewShares > 0n && (
                <p className="text-sm text-muted-foreground mt-2">
                  Calling deposit will give you{" "}
                  <Amount amount={previewShares} />
                  shares
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <AllowanceCheck
                tokenAddress={vault?.token?.address!}
                amount={amountInWei}
                spender={id!}
              >
                <Button
                  onClick={() => deposit.mutate(amountInWei)}
                  disabled={!amount || amount <= 0 || deposit.isPending}
                  className="w-full"
                >
                  {deposit.isPending ? "Depositing..." : "Deposit"}
                </Button>
              </AllowanceCheck>

              <AllowanceCheck
                tokenAddress={vault?.token?.address!}
                amount={amountInWei}
                spender={id!}
              >
                <Button
                  onClick={() => fund.mutate(amountInWei)}
                  disabled={!amount || amount <= 0 || fund.isPending}
                  variant="secondary"
                  className="w-full"
                >
                  {fund.isPending ? "Funding..." : "Fund"}
                </Button>
              </AllowanceCheck>
            </div>

            <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
              <p>
                • <strong>Deposit:</strong> Mint shares in proportion to your
                contribution
              </p>
              <p>
                • <strong>Fund:</strong> Direct donation without minting shares
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
