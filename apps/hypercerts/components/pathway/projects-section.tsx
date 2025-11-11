"use client";

import { useQuery } from "@tanstack/react-query";
import { useHypercerts, useListHypercerts, calculateVaultLevel } from "@workspace/sdk";
import { Address } from "viem";
import Link from "next/link";
import { ImageIcon, ArrowRight } from "lucide-react";
import { Amount } from "../token-amount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useState } from "react";

type ProjectVault = {
  id: string;
  parent?: string;
  metadata: Record<string, any>;
};

export function PathwayProjectsSection({
  pathwayVaultId,
}: {
  pathwayVaultId: Address | null;
}) {
  const { sdk } = useHypercerts();
  const [sortBy, setSortBy] = useState<"recent" | "funded" | "verified">("recent");
  const [filter, setFilter] = useState<"all" | "seeking" | "progress" | "verified">("all");

  // Get all vaults to calculate levels
  const { data: allVaults } = useListHypercerts({});

  // Get child vaults (projects) of this pathway
  const { data: projects, isLoading } = useQuery({
    queryKey: ["pathway-projects", pathwayVaultId],
    queryFn: async () => {
      if (!pathwayVaultId || !sdk || !allVaults?.items) return [];

      // Get all child vaults
      const children = allVaults.items.filter(
        (v) => v.parent === pathwayVaultId.toLowerCase()
      );

      // Filter to projects (level 3 or metadata.vaultType === "project")
      const projectVaults = children.filter((vault) => {
        const parentVault = allVaults.items.find(
          (v) => v.id.toLowerCase() === vault.parent?.toLowerCase()
        );
        const level = calculateVaultLevel(vault, parentVault);
        return (
          level > 2 ||
          vault.metadata?.vaultType === "project" ||
          vault.metadata?.pathwaySlug
        );
      });

      return projectVaults as ProjectVault[];
    },
    enabled: Boolean(pathwayVaultId && sdk && allVaults?.items),
  });

  // Get balances for all projects
  const projectIds = projects?.map((p) => p.id) || [];
  const { data: balances } = useQuery({
    queryKey: ["project-balances", projectIds],
    queryFn: async () => {
      if (!sdk || !projectIds.length) return {};
      const balanceMap: Record<string, any> = {};
      await Promise.all(
        projectIds.map(async (id) => {
          try {
            const balance = await sdk.vault.balance(id as Address);
            balanceMap[id] = balance;
          } catch (e) {
            balanceMap[id] = null;
          }
        })
      );
      return balanceMap;
    },
    enabled: Boolean(sdk && projectIds.length > 0),
  });

  if (!pathwayVaultId) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Pathway vault not found. Projects will appear here once the pathway is seeded.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Loading projects...</div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="py-12 text-center border border-border rounded-lg bg-muted/20">
        <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Be the first to create a project for this pathway!
        </p>
        <Link
          href="/certs/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm"
        >
          Create Project
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Sort and filter projects
  let filteredProjects = [...projects];

  // Apply filter
  if (filter === "seeking") {
    // Projects with low funding
    filteredProjects = filteredProjects.filter((p) => {
      const balance = balances?.[p.id];
      return !balance || balance.assets === 0n;
    });
  } else if (filter === "progress") {
    // Projects with milestones (we'll add this later)
    // For now, just show all with funding
    filteredProjects = filteredProjects.filter((p) => {
      const balance = balances?.[p.id];
      return balance && balance.assets > 0n;
    });
  } else if (filter === "verified") {
    // Projects with verified milestones (we'll add this later)
    // For now, show all
  }

  // Apply sort
  if (sortBy === "funded") {
    filteredProjects.sort((a, b) => {
      const balanceA = balances?.[a.id]?.assets || 0n;
      const balanceB = balances?.[b.id]?.assets || 0n;
      return balanceB > balanceA ? 1 : balanceB < balanceA ? -1 : 0;
    });
  } else if (sortBy === "recent") {
    // Sort by creation date (most recent first)
    filteredProjects.sort((a, b) => {
      const dateA = a.metadata?.createdAt
        ? new Date(a.metadata.createdAt).getTime()
        : 0;
      const dateB = b.metadata?.createdAt
        ? new Date(b.metadata.createdAt).getTime()
        : 0;
      return dateB - dateA;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            Projects ({filteredProjects.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Projects applying to this pathway
          </p>
        </div>
        <Link
          href="/certs/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors text-sm"
        >
          Create Project
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-4">
        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="seeking">Seeking Funding</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="funded">Most Funded</SelectItem>
            <SelectItem value="verified">Most Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const balance = balances?.[project.id];
          const fundingGoal = project.metadata?.fundingGoal
            ? BigInt(project.metadata.fundingGoal)
            : null;
          const progress =
            fundingGoal && balance
              ? Number((balance.assets * 100n) / fundingGoal)
              : null;

          return (
            <Link
              key={project.id}
              href={`/certs/${project.id}`}
              className="group bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-all duration-200 hover:shadow-md block"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
                {project.metadata?.image ? (
                  <img
                    src={`${project.metadata.image}?auto=compress%2Cformat&w=600`}
                    alt={project.metadata?.title || "Project image"}
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
                  {project.metadata?.title || "Untitled Project"}
                </h4>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                  {project.metadata?.description || "No description available."}
                </p>

                {fundingGoal && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Funding:</span>
                      <span className="text-xs font-medium">
                        {balance ? (
                          <Amount amount={balance.assets} hideSymbol />
                        ) : (
                          "--"
                        )}{" "}
                        / <Amount amount={fundingGoal} hideSymbol />
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-foreground h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(progress || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {!fundingGoal && (
                  <div className="mb-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Funding:</span>
                      <span className="font-medium">
                        {balance ? (
                          <Amount amount={balance.assets} hideSymbol />
                        ) : (
                          "--"
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="px-2 py-1 bg-foreground/5 text-foreground rounded-full text-xs">
                    Project
                  </span>
                  <span className="text-xs text-muted-foreground">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

