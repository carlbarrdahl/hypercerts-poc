"use client";

import Link from "next/link";
import { useListHypercerts } from "@workspace/sdk";
import { Grid } from "../grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { BannerImage } from "../banner-image";

export function VaultsList() {
  const { data, ...rest } = useListHypercerts({});

  console.log("data", data, rest);
  return (
    <div>
      <h3>Vaults List</h3>
      <Grid
        {...rest}
        columns={[1, 3, 4]}
        data={data?.items}
        renderItem={(item) => <Vault key={item.id} {...item} />}
      />
    </div>
  );
}

export function Vault({
  id,
  metadata,
}: {
  id: string;
  metadata: {
    title: string;
    description: string;
    image: string;
    geoJSON: string;
  };
}) {
  return (
    <Link href={`/certs/${id}`} className="block p-2 hover:underline">
      <Card className="pt-0 gap-2">
        <BannerImage className="rounded-t-xl" size="sm" src={metadata?.image} />
        <CardHeader>
          <CardTitle className="truncate">{metadata?.title}</CardTitle>
        </CardHeader>
        <CardContent className="">
          <CardDescription className="line-clamp-3">
            {metadata?.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
