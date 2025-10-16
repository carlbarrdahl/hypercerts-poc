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

  const { data: balance } = useQuery({
    queryKey: ["vault", id, "balance"],
    queryFn: () => sdk?.vault.balance(id),
    enabled: Boolean(id),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle> Contributors List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Current value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.map((item) => {
              const shares = BigInt(item.shares) ?? 0n;
              const inPercentage =
                (Number(shares) / Number(balance?.shares)) * 100;

              const price = balance?.price ?? 1n;
              // console.log({ price, shares });
              return (
                <TableRow>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>
                    <Amount amount={item.shares} />
                    <span className="text-xs text-muted-foreground">
                      (
                      {balance?.shares! > 0
                        ? `${inPercentage.toFixed(2)}%`
                        : "--"}
                      )
                    </span>
                  </TableCell>
                  <TableCell>
                    <Amount amount={item.assets} />
                  </TableCell>
                  <TableCell>
                    <Amount
                      amount={shares * price}
                      symbol={item.token?.symbol}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
