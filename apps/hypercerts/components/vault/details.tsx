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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {vault?.metadata?.title}
        </h1>
      </div>

      <BannerImage src={vault?.metadata?.image} />
      <p className="text-muted-foreground text-lg">
        {vault?.metadata?.description}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vault Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Total Assets
              </span>
              <TokenAmount
                amount={balance?.assets}
                token={vault?.token?.address!}
              />
            </div>
            <div className="flex justify-between items-center py-2 border-b">
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

        <Card>
          <CardHeader>
            <CardTitle>Creator Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
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
        <Card>
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
  );
}
