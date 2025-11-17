"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Wallet } from "lucide-react";
import { AllowanceCheck } from "../allowance-check";
import { Address } from "viem";

interface FundingCardProps {
  amount: number | null;
  setAmount: (amount: number | null) => void;
  amountInWei: bigint;
  onFund: () => void;
  isLoading: boolean;
  tokenSymbol?: string;
  tokenAddress: Address;
  spenderAddress: Address;
  variant?: "default" | "enhanced";
  title?: string;
  description?: string;
  helpText?: string;
  buttonText?: string;
  loadingText?: string;
}

export function FundingCard({
  amount,
  setAmount,
  amountInWei,
  onFund,
  isLoading,
  tokenSymbol = "tokens",
  tokenAddress,
  spenderAddress,
  variant = "default",
  title = "Take Action",
  description = "Support by funding",
  helpText = "Funding provides direct support without receiving shares, helping to amplify impact.",
  buttonText = "Fund",
  loadingText = "Funding...",
}: FundingCardProps) {
  const isEnhanced = variant === "enhanced";

  return (
    <Card
    // className={
    //   isEnhanced
    //     ? "border-2 border-primary/20 shadow-lg bg-gradient-to-br from-background to-primary/5"
    //     : "border border-border"
    // }
    >
      <CardHeader className={isEnhanced ? "pb-4" : ""}>
        <CardTitle
          className={`text-lg ${isEnhanced ? "flex items-center gap-2" : ""}`}
        >
          {isEnhanced && <Wallet className="w-5 h-5 text-primary" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnhanced ? (
          <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Amount to fund
            </label>
            <Input
              type="number"
              value={amount ?? ""}
              placeholder={`0.00 ${tokenSymbol}`}
              onChange={(e) => setAmount(Number(e.target.value))}
              disabled={isLoading}
              className="text-lg font-semibold"
            />
          </div>
        ) : (
          <Input
            type="number"
            value={amount ?? ""}
            placeholder={`Amount in ${tokenSymbol}`}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={isLoading}
          />
        )}

        <div className="space-y-2">
          <AllowanceCheck
            className={"w-full"}
            tokenAddress={tokenAddress}
            amount={amountInWei}
            spender={spenderAddress}
          >
            <Button
              onClick={onFund}
              disabled={!amount || amount <= 0 || isLoading}
              variant={isEnhanced ? "default" : "secondary"}
              className={`w-full ${isEnhanced ? "h-11 font-semibold" : ""}`}
              isLoading={isLoading}
              loadingText={loadingText}
            >
              {buttonText}
            </Button>
          </AllowanceCheck>
        </div>

        {isEnhanced ? (
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">💡 Funding</span>{" "}
              {helpText}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">{helpText}</p>
        )}
      </CardContent>
    </Card>
  );
}
