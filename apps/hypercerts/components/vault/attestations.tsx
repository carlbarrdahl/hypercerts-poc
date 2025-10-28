"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  useHypercertsCreateAttestation,
  useHypercertsAttestations,
} from "@workspace/sdk";
import { Address, zeroAddress } from "viem";
import { Amount, TokenAmount } from "../token-amount";
import { EnsName } from "../ens";
import { truncate } from "@/lib/truncate";
import { timeAgo } from "@/lib/format";

type Visibility = "private" | "organization" | "draft" | "published";

export function Attestations({ id }: { id: Address }) {
  const { mutate, isPending: isCreating } = useHypercertsCreateAttestation();
  const [visibility, setVisibility] = useState<Visibility>("published");

  const { data, error, isPending, isRefetching } = useHypercertsAttestations(
    {
      orderBy: "createdAt",
      orderDirection: "desc",
      where: {
        recipient: id,
      },
    },
    {
      refetchInterval: 1000,
    }
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Attestations</CardTitle>
          <div className="flex gap-3 items-center">
            <Select
              value={visibility}
              onValueChange={(value) => setVisibility(value as Visibility)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="draft">Public Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Button
              isLoading={isCreating}
              loadingText="Creating..."
              disabled={isCreating || !id}
              onClick={() =>
                mutate({
                  recipient: id,
                  visibility,
                  data: {
                    type: "milestone",
                    metadata: {
                      title: "John Doe",
                      description: "John Doe",
                      image: "https://via.placeholder.com/150",
                      geoJSON: {
                        type: "Polygon",
                        coordinates: [
                          [
                            [0, 0],
                            [1, 0],
                          ],
                        ],
                      },
                    },
                  },
                })
              }
            >
              Create Attestation
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!data?.items?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No attestations yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Attester</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items?.map((item, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">
                      {truncate(item.id)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      <EnsName address={item.attester} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {timeAgo(item.createdAt)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(item.decodedParsed, null, 2)}
                      </pre>
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
