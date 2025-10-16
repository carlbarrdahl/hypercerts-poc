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
        <CardTitle>Attestations</CardTitle>

        <div className="flex gap-4 items-center">
          <Select
            value={visibility}
            onValueChange={(value) => setVisibility(value as Visibility)}
          >
            <SelectTrigger>
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
            loadingText="Creating Attestation..."
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Attester</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Decoded Parsed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.map((item) => {
              return (
                <TableRow>
                  <TableCell>
                    <pre>{truncate(item.id)}</pre>
                  </TableCell>
                  <TableCell>
                    <pre>
                      <EnsName address={item.attester} />
                    </pre>
                  </TableCell>
                  <TableCell>{timeAgo(item.createdAt)}</TableCell>
                  <TableCell>{JSON.stringify(item.decodedParsed)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
