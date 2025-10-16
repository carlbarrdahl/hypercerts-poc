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
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useHypercertsCreateAttestation } from "@workspace/sdk";
import { zeroAddress } from "viem";

type Visibility = "private" | "organization" | "draft" | "published";

export function Certs() {
  const { mutate } = useHypercertsCreateAttestation();
  const [visibility, setVisibility] = useState<Visibility>("private");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certs</CardTitle>

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
            onClick={() =>
              mutate({
                recipient: zeroAddress,
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
            Create Cert
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cert</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </CardContent>
    </Card>
  );
}
