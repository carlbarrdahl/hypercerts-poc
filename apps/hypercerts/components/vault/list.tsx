"use client";

import Link from "next/link";
import { useListHypercerts } from "@workspace/sdk";
import { Grid } from "../grid";

export function VaultsList() {
  const { data, ...rest } = useListHypercerts({ orderBy: "id" });

  console.log("data", data, rest);
  return (
    <div>
      <h3>Vaults List</h3>
      <Grid
        {...rest}
        data={data?.items}
        renderItem={(item) => <Vault key={item.id} {...item} />}
      />
    </div>
  );
}

export function Vault({ id, metadata }: { id: string; metadata: string }) {
  return (
    <Link href={`/certs/${id}`} className="block p-2 hover:underline">
      <h3 className="text-lg font-bold">{metadata}</h3>
    </Link>
  );
}
