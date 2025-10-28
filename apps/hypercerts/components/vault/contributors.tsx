"use client";

import { useHypercerts, useListContributors } from "@workspace/sdk";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Address } from "viem";
import { Amount, TokenAmount } from "../token-amount";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export function ContributorsList({ id }: { id: Address }) {
  const { sdk } = useHypercerts();
  const { data, error, isPending, isRefetching } = useListContributors(
    {
      orderBy: "shares",
      orderDirection: "desc",
      where: {
        vault: id,
      },
    },
    {
      refetchInterval: 1000,
    }
  );

  const { data: vaultData } = useQuery({
    queryKey: ["vault", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items[0],
  });

  const { data: balance } = useQuery({
    queryKey: ["vault", id, "balance"],
    queryFn: () => sdk?.vault.balance(id) ?? null,
    enabled: Boolean(id),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        {!data?.items?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No contributors yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Assets</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items?.map((item, i) => {
                const shares = BigInt(item.shares) ?? 0n;
                const inPercentage =
                  (Number(shares) / Number(balance?.shares)) * 100;

                const price = balance?.price ?? 1n;
                return (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">
                      {item.address}
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <Amount amount={item.shares} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {balance?.shares! > 0
                          ? `${inPercentage.toFixed(2)}%`
                          : "--"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Amount amount={item.assets} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Amount
                        amount={shares * price}
                        symbol={vaultData?.token?.symbol}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
