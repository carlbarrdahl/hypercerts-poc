"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHypercerts, useListContributors } from "@workspace/sdk";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";
import { Address, parseUnits } from "viem";
import { AllowanceCheck } from "../allowance-check";
import { Amount, TokenAmount } from "../token-amount";
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
import { ArrowLeft, ImageIcon } from "lucide-react";
import { PathwaySelector } from "../pathway-selector";
import { oneEarthFramework } from "@/lib/pathway-data";
import { findPathwayBySlug } from "@/lib/pathway-utils";
import { toast } from "sonner";

export function VaultDetails({ id }: { id: Address }) {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { sdk } = useHypercerts();
  const { data: vault } = useQuery({
    queryKey: ["vault", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items[0],
    refetchInterval: 1000,
  });

  console.log("vault", id, sdk);
  const { data: balance, error } = useQuery({
    queryKey: ["vault", id, "balance"],
    queryFn: () => sdk?.vault.balance(id) ?? null,
    enabled: Boolean(id),
    refetchInterval: 1000,
  });
  console.log("error", error);
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
    onSuccess,
  });
  const withdraw = useMutation({
    mutationFn: async (wei: bigint) => sdk?.vault.withdraw(id, wei),
    onSuccess,
  });
  const fund = useMutation({
    mutationFn: async (wei: bigint) => sdk?.vault.fund(id, wei, true),
    onSuccess,
  });

  console.log("---------", balance, error);
  const amountInWei = parseUnits(String(amount ?? 0), vault?.token?.decimals!);

  const pathwaySlug = vault?.metadata?.pathwaySlug as string | undefined;
  const pathwayData = pathwaySlug
    ? findPathwayBySlug(oneEarthFramework, pathwaySlug)
    : null;

  const handlePathwaySelect = async (slug: string) => {
    // Note: This would require implementing metadata update functionality
    // For now, we'll just show a toast and store it locally
    toast.info(
      "Pathway linking will be saved when metadata update is implemented"
    );
    // TODO: Implement metadata update via SDK
    // await sdk?.vault.update(id, {
    //   ...vault,
    //   metadata: { ...vault.metadata, pathwaySlug: slug }
    // });
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vaults
          </Link>
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-semibold mt-1">
              {vault?.metadata?.title || "Untitled Vault"}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8 bg-muted flex items-center justify-center">
          {vault?.metadata?.image ? (
            <img
              src={`${vault.metadata.image}?auto=compress%2Cformat&w=1200`}
              alt={vault?.metadata?.title || "Vault image"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground p-12">
              <ImageIcon className="w-16 h-16 opacity-30" />
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {vault?.metadata?.description || "No description available."}
          </p>

          {/* Linked Pathway Display */}
          {pathwayData && (
            <div className="mb-8 p-4 bg-muted/50 border border-border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Linked Solution Pathway
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {pathwayData.pillar.name} / {pathwayData.subPillar.name}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">
                  {pathwayData.pathway.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {pathwayData.pathway.summary}
                </p>
                <Link
                  href={`/solutions/${pathwaySlug}`}
                  className="inline-flex items-center gap-2 text-sm text-foreground hover:text-muted-foreground transition-colors mt-2"
                >
                  View Pathway Details
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>
          )}

          {/* Pathway Linking Section */}
          {address === vault?.owner && (
            <div className="mb-8 p-4 bg-background border border-border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Link to Pathway</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Connect this vault to a solution pathway from the OneEarth
                Solutions Framework.
              </p>
              <PathwaySelector
                onSelect={handlePathwaySelect}
                currentPathwaySlug={pathwaySlug}
              />
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Vault Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Total Assets
                </span>
                <TokenAmount
                  amount={balance?.assets}
                  token={vault?.token?.address!}
                />
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Total Shares
                </span>
                <TokenAmount
                  amount={balance?.shares}
                  token={vault?.token?.address!}
                />
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">
                  Price per Share
                </span>
                <span className="font-medium">
                  {balance?.price} {vault?.token?.symbol}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Creator Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Assets</span>
                <Amount amount={creator?.assets} />
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Shares</span>
                <Amount amount={creator?.shares} />
              </div>
            </CardContent>
          </Card>
        </div>

        {address && (
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Manage Position</CardTitle>
              <CardDescription>
                Deposit, withdraw, or fund this vault
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder={`Amount (${vault?.token?.symbol})`}
                value={amount ?? ""}
                onChange={(e) => setAmount(Number(e.target.value) || null)}
                className="w-full"
              />
              <div className="flex flex-wrap gap-2">
                <AllowanceCheck
                  tokenAddress={vault?.token?.address!}
                  amount={amountInWei}
                  spender={id!}
                >
                  <Button
                    onClick={() => {
                      deposit.mutate(amountInWei);
                      setAmount(null);
                    }}
                    disabled={!amount || amount <= 0}
                  >
                    Deposit
                  </Button>
                </AllowanceCheck>
                <Button
                  onClick={() => {
                    withdraw.mutate(amountInWei);
                    setAmount(null);
                  }}
                  disabled={!amount || amount <= 0}
                  variant="outline"
                >
                  Withdraw
                </Button>
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
                    disabled={!amount || amount <= 0}
                    variant="secondary"
                  >
                    Fund
                  </Button>
                </AllowanceCheck>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
