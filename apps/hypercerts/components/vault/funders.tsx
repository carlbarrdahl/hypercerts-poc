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
  console.log(data?.items);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funders List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Funding</TableHead>
              <TableHead>% of total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.map((item) => {
              const inPercentage =
                (Number(item.assets ?? 0) / Number(balance?.assets)) * 100;
              return (
                <TableRow>
                  <TableCell>{item.address}</TableCell>
                  <TableCell>
                    <Amount amount={item.assets} symbol={item.token?.symbol} />
                  </TableCell>
                  <TableCell>{inPercentage.toFixed(2)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
