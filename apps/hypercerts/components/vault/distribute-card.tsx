"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Address } from "viem";

interface DistributeCardProps {
  vaultId: Address;
  variant?: "default" | "enhanced";
  title?: string;
  description?: string;
  buttonText?: string;
  helpText?: string;
}

export function DistributeCard({
  vaultId,
  variant = "default",
  title = "Distribute Funds",
  description = "Transfer funds to project vaults",
  buttonText = "Open Distribution Flow",
  helpText = "As the vault owner, you can distribute funds to multiple project vaults using an interactive flow interface.",
}: DistributeCardProps) {
  const isEnhanced = variant === "enhanced";

  return (
    <Card
    //   className={
    //     isEnhanced
    //       ? "border-2 border-purple-500/30 shadow-lg bg-gradient-to-br from-purple-500/5 to-purple-500/10"
    //       : "border border-border bg-primary/5"
    //   }
    >
      <CardHeader className={isEnhanced ? "pb-4" : ""}>
        <CardTitle
          className={`text-lg ${isEnhanced ? "flex items-center gap-2" : "flex items-center gap-2"}`}
        >
          <ArrowRightLeft
            className={`w-5 h-5 ${isEnhanced ? "text-purple-600" : ""}`}
          />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/distribute/${vaultId}`}>
          <Button
            variant="default"
            className={`w-full ${isEnhanced ? "h-11 font-semibold" : ""}`}
          >
            {buttonText}
          </Button>
        </Link>
        {isEnhanced ? (
          <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {helpText}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-3">{helpText}</p>
        )}
      </CardContent>
    </Card>
  );
}
