"use client";

import { useHypercerts, useListFunders } from "@workspace/sdk";
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

export function FundersList({ id }: { id: Address }) {
  const { sdk } = useHypercerts();
  const { data, error, isPending } = useListFunders(
    {
      orderBy: "assets",
      orderDirection: "desc",
      where: {
        vault: id,
      },
    },
    {
      refetchInterval: 1000,
    }
  );

  const { data: balance } = useQuery({
    queryKey: ["vault", id, "balance"],
    queryFn: () => sdk?.vault.balance(id),
    enabled: Boolean(id),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funders</CardTitle>
      </CardHeader>
      <CardContent>
        {!data?.items?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No funders yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Funding</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items?.map((item, i) => {
                const inPercentage =
                  (Number(item.assets ?? 0) / Number(balance?.assets)) * 100;
                return (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">
                      {item.address}
                    </TableCell>
                    <TableCell className="text-right">
                      <Amount
                        amount={item.assets}
                        symbol={item.token?.symbol}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {inPercentage.toFixed(2)}%
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
