"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  useListHypercerts,
  getVaultLevelLabel,
  calculateVaultLevel,
  useHypercerts,
} from "@workspace/sdk";
import { Grid } from "../grid";
import { ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Amount } from "../token-amount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { oneEarthFramework } from "@/lib/pathway-data";
import { generatePathwaySlug } from "@/lib/pathway-utils";

type VaultType = "all" | "projects" | "pathways" | "pillars";
type VaultStatus = "all" | "seeking" | "funded" | "progress";
type SortOption = "recent" | "funded" | "verified";

export function VaultsList() {
  const { data, ...rest } = useListHypercerts({});
  const [typeFilter, setTypeFilter] = useState<VaultType>("all");
  const [pathwayFilter, setPathwayFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<VaultStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Get all pathway slugs for filter dropdown
  const pathwayOptions = useMemo(() => {
    return oneEarthFramework.pillars.flatMap((pillar) =>
      pillar.subPillars.flatMap((subPillar) =>
        subPillar.pathways.map((pathway) => ({
          slug: generatePathwaySlug(pathway.name),
          name: pathway.name,
        }))
      )
    );
  }, []);

  // Filter and sort vaults
  const filteredVaults = useMemo(() => {
    if (!data?.items) return [];

    let filtered = [...data.items];

    // Filter by type
    if (typeFilter === "projects") {
      filtered = filtered.filter((vault) => {
        const parentVault = vault.parent
          ? data.items.find((v) => v.id === vault.parent)
          : null;
        const level = calculateVaultLevel(vault, parentVault);
        return (
          level > 2 ||
          vault.metadata?.vaultType === "project" ||
          vault.metadata?.pathwaySlug
        );
      });
    } else if (typeFilter === "pathways") {
      filtered = filtered.filter((vault) => {
        const parentVault = vault.parent
          ? data.items.find((v) => v.id === vault.parent)
          : null;
        const level = calculateVaultLevel(vault, parentVault);
        return level === 2;
      });
    } else if (typeFilter === "pillars") {
      filtered = filtered.filter((vault) => {
        const parentVault = vault.parent
          ? data.items.find((v) => v.id === vault.parent)
          : null;
        const level = calculateVaultLevel(vault, parentVault);
        return level === 0;
      });
    }

    // Filter by pathway
    if (pathwayFilter !== "all") {
      filtered = filtered.filter(
        (vault) => vault.metadata?.pathwaySlug === pathwayFilter
      );
    }

    // Note: Status and sort filters would require balance data
    // For now, we'll implement basic sorting by level/type

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => {
        const dateA = a.metadata?.createdAt
          ? new Date(a.metadata.createdAt).getTime()
          : 0;
        const dateB = b.metadata?.createdAt
          ? new Date(b.metadata.createdAt).getTime()
          : 0;
        return dateB - dateA;
      });
    }

    return filtered;
  }, [data?.items, typeFilter, pathwayFilter, statusFilter, sortBy]);

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
          {typeFilter === "projects"
            ? "Projects"
            : typeFilter === "pathways"
              ? "Pathways"
              : typeFilter === "pillars"
                ? "Pillars"
                : "All Vaults"}
        </h2>
        <p className="text-muted-foreground max-w-2xl leading-relaxed mb-6">
          {typeFilter === "projects"
            ? "Explore projects applying to solution pathways"
            : "Explore all impact vaults and hypercerts created on the platform."}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            value={typeFilter}
            onValueChange={(v: VaultType) => setTypeFilter(v)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="pathways">Pathways</SelectItem>
              <SelectItem value="pillars">Pillars</SelectItem>
            </SelectContent>
          </Select>

          {typeFilter === "projects" && (
            <Select
              value={pathwayFilter}
              onValueChange={(v) => setPathwayFilter(v)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pathway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pathways</SelectItem>
                {pathwayOptions.map((pathway) => (
                  <SelectItem key={pathway.slug} value={pathway.slug}>
                    {pathway.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={sortBy}
            onValueChange={(v: SortOption) => setSortBy(v)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="funded">Most Funded</SelectItem>
              <SelectItem value="verified">Most Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Grid
        {...rest}
        columns={[1, 2, 3]}
        data={filteredVaults}
        renderItem={(item) => (
          <Vault
            key={item.id}
            id={item.id}
            parent={item.parent}
            metadata={item.metadata}
            allVaults={data?.items || []}
          />
        )}
      />
    </div>
  );
}

export function Vault({
  id,
  parent,
  metadata,
  allVaults,
}: {
  id: string;
  parent?: string;
  metadata: Record<string, any>;
  allVaults: any[];
}) {
  // Find parent vault to calculate accurate level
  const parentVault = parent ? allVaults.find((v) => v.id === parent) : null;
  const level = calculateVaultLevel({ id, parent } as any, parentVault);
  const levelLabel = getVaultLevelLabel(level);

  // Fetch balance for this vault
  const { sdk } = useHypercerts();
  const { data: balance } = useQuery({
    queryKey: ["vault", id, "balance"],
    queryFn: () => sdk?.vault.balance(id as any) ?? null,
    enabled: Boolean(id && sdk),
  });

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
        <div className="mb-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Funding:</span>
            <span className="font-medium">
              $
              {balance?.assets ? (
                <Amount amount={balance.assets} hideSymbol />
              ) : (
                "--"
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="px-2 py-1 bg-foreground/5 text-foreground rounded-full text-xs">
            {level > 2 || metadata?.vaultType === "project"
              ? "Project"
              : levelLabel}
          </span>
          {metadata?.pathwaySlug && (
            <span className="px-2 py-1 bg-foreground/5 text-foreground rounded-full text-xs">
              Pathway Linked
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
