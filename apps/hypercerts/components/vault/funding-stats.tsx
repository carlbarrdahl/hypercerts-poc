"use client";

import { Address, formatUnits } from "viem";
import { Card, CardContent } from "@workspace/ui/components/card";
import { TrendingUp, Users, Wallet } from "lucide-react";
import { useHypercerts } from "@workspace/sdk";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@workspace/ui/components/skeleton";

function formatNumber(value: string, decimals: number = 2): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  isLoading,
  colorScheme = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  suffix?: string;
  isLoading?: boolean;
  colorScheme?: "primary" | "blue" | "green";
}) {
  const colors = {
    primary: {
      border: "border-primary/20",
      bg: "from-primary/5 to-transparent",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    blue: {
      border: "border-blue-500/20",
      bg: "from-blue-500/5 to-transparent",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    green: {
      border: "border-green-500/20",
      bg: "from-green-500/5 to-transparent",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
    },
  };

  const scheme = colors[colorScheme];

  return (
    <Card className={`${scheme.border} group`}>
      <CardContent className="px-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-3">
              {label}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                {suffix && (
                  <span className="text-sm text-muted-foreground font-medium">
                    {suffix}
                  </span>
                )}
              </div>
            )}
          </div>
          <div
            className={`p-3 ${scheme.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`w-6 h-6 ${scheme.iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FundingStats({ id }: { id: Address }) {
  const { sdk } = useHypercerts();
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["pathway", id, "balance"],
    queryFn: () => sdk?.vault.balance(id) ?? null,
    enabled: Boolean(id),
    refetchInterval: 1000,
  });

  const { data: vault, isLoading: isLoadingVault } = useQuery({
    queryKey: ["vault", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items[0],
    refetchInterval: 1000,
  });

  const isLoading = isLoadingBalance || isLoadingVault;
  const decimals = vault?.token?.decimals || 18;
  const symbol = vault?.token?.symbol || "TOKEN";

  const totalAssets = formatNumber(
    formatUnits(balance?.assets ?? 0n, decimals),
    2
  );

  const totalShares = formatNumber(
    formatUnits(balance?.shares ?? 0n, decimals),
    2
  );

  const pricePerShare = formatNumber(balance?.price.toString() || "0", 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Wallet}
          label="Total Funding"
          value={totalAssets}
          suffix={symbol}
          isLoading={isLoading}
          colorScheme="primary"
        />
        {/* 
        <StatCard
          icon={Users}
          label="Total Shares"
          value={totalShares}
          isLoading={isLoading}
          colorScheme="blue"
        />

        <StatCard
          icon={TrendingUp}
          label="Price per Share"
          value={pricePerShare}
          suffix={symbol}
          isLoading={isLoading}
          colorScheme="green"
        /> */}
      </div>
    </div>
  );
}
