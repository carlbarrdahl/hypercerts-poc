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
  const { data: vault } = useQuery({
    queryKey: ["vault", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items[0],
    refetchInterval: 1000,
  });
  const { data: balance } = useQuery({
    queryKey: ["vault", id, "balance"],
    queryFn: () => sdk?.vault.balance(id) ?? null,
    enabled: Boolean(id),
  });

  console.log("vault", vault);
  const { data: creator } = useListContributors(
    {
      where: {
        vault: id,
        address: vault?.owner,
      },
    },
    {
      select: (data) => data?.items[0],
      refetchInterval: 1000,
    }
  );

  const [amount, setAmount] = useState<number | null>(null);
  const { sdk } = useHypercerts();

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

  const amountInWei = parseUnits(String(amount ?? 0), vault?.token?.decimals!);
  return (
    <div>
      <h3 className="text-2xl font-bold">{vault?.metadata?.title}</h3>
      <p>{vault?.metadata?.description}</p>
      <BannerImage src={vault?.metadata?.image} />
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1">
            <div>Creator assets:</div>
            <Amount amount={creator?.assets} />
          </div>
          <div className="flex items-center gap-1">
            <div>Creator shares:</div>
            <Amount amount={creator?.shares} />
          </div>
          <div className="flex items-center gap-1">
            <div>Assets:</div>
            <TokenAmount
              amount={balance?.assets}
              token={vault?.token?.address!}
            />
          </div>
          <div className="flex items-center gap-1">
            <div>Shares:</div>
            <TokenAmount
              amount={balance?.shares}
              token={vault?.token?.address!}
            />
          </div>
          <div className="flex items-center gap-1">
            <div>Price per share:</div>
            <div>
              {balance?.price} {vault?.token?.symbol}
            </div>
          </div>
          {/* <pre>
        {JSON.stringify({ id, parent, percent, metadata, token }, null, 2)}
      </pre> */}
          <Input
            type="number"
            // value={amount}
            placeholder="Amount"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <div className="flex gap-1">
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
              >
                Deposit
              </Button>
            </AllowanceCheck>
            <Button
              onClick={() => {
                withdraw.mutate(amountInWei);
                setAmount(null);
              }}
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
              >
                Fund
              </Button>
            </AllowanceCheck>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
