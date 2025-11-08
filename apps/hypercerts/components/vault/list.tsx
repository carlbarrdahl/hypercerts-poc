"use client";

import Link from "next/link";
import { useListHypercerts } from "@workspace/sdk";
import { Grid } from "../grid";
import { ImageIcon } from "lucide-react";

export function VaultsList() {
  const { data, ...rest } = useListHypercerts({});

  console.log("data", data, rest);
  return (
    <div>
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
          All Vaults
        </h2>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Explore all impact vaults and hypercerts created on the platform.
        </p>
      </div>
      <Grid
        {...rest}
        columns={[1, 2, 3]}
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
    pathwaySlug?: string;
  };
}) {
  return (
    <Link
      href={`/certs/${id}`}
      className="group bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-all duration-200 hover:shadow-md block"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
        {metadata?.image ? (
          <img
            src={`${metadata.image}?auto=compress%2Cformat&w=600`}
            alt={metadata?.title || "Vault image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-8">
            <ImageIcon className="w-12 h-12 opacity-30" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-semibold mb-2 text-sm leading-tight group-hover:text-muted-foreground transition-colors">
          {metadata?.title || "Untitled Vault"}
        </h4>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
          {metadata?.description || "No description available."}
        </p>
        {metadata?.pathwaySlug && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="px-2 py-1 bg-foreground/5 text-foreground rounded-full text-xs">
              Pathway Linked
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
