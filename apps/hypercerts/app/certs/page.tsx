"use client";

import { useListHypercerts, calculateVaultLevel } from "@workspace/sdk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Search,
  Plus,
  Filter,
  Grid3x3,
  List,
  MapPin,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { oneEarthFramework } from "@/lib/pathway-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

type ViewMode = "grid" | "list";
type FilterCategory = "all" | string;

export default function CertsPage() {
  const { data: vaultsData, isLoading } = useListHypercerts({});
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Get all unique pillars for filtering
  const pillars = oneEarthFramework.pillars;

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    if (!vaultsData?.items) return [];

    console.log("Raw vaults data:", vaultsData.items);

    let filtered = vaultsData.items.filter((vault) => {
      // Only show project-level vaults (exclude root solutions/regions)
      // Projects have metadata.type === "project"
      const isProject = vault.metadata?.type === "project";

      //   if (!isProject) return false;

      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        vault.metadata?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vault.metadata?.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vault.metadata?.region
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vault.metadata?.pathway
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        filterCategory === "all" ||
        vault.metadata?.pathway?.includes(filterCategory);

      return matchesSearch && matchesCategory;
    });

    // Sort
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return Number(b.id) - Number(a.id);
        case "oldest":
          return Number(a.id) - Number(b.id);
        case "name":
          return (a.metadata?.title || "").localeCompare(
            b.metadata?.title || ""
          );
        default:
          return 0;
      }
    });

    console.log("Filtered projects:", filtered);
    return filtered;
  }, [vaultsData, searchQuery, filterCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Projects</h1>
              <p className="text-muted-foreground mt-2">
                Discover and support climate action projects
              </p>
            </div>
            <Link href="/certs/create">
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <Tabs value={filterCategory} onValueChange={setFilterCategory}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                {pillars.map((pillar) => (
                  <TabsTrigger key={pillar.id} value={pillar.name}>
                    {pillar.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Be the first to create a project"}
            </p>
            <Link href="/certs/create">
              <Button>Create Project</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((vault) => (
                  <ProjectCard key={vault.id} vault={vault} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((vault) => (
                  <ProjectListItem key={vault.id} vault={vault} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ vault }: { vault: any }) {
  const hasImage = vault.metadata?.image;
  console.log("Vault:", vault);
  return (
    <Link href={`/certs/${vault.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
        <div className="aspect-[16/9] overflow-hidden bg-muted relative">
          {hasImage ? (
            <img
              src={`${vault.metadata.image}?auto=compress%2Cformat&w=600`}
              alt={vault.metadata?.title || "Project"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          {vault.metadata?.pathway && (
            <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm">
              {vault.metadata.pathway}
            </Badge>
          )}
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {vault.metadata?.title || "Untitled Project"}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {vault.metadata?.description || "No description available"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {vault.metadata?.region && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {vault.metadata.region}
              </div>
            )}
            {vault.metadata?.budget && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <DollarSign className="w-3 h-3" />$
                {(vault.metadata.budget / 1000).toFixed(0)}K
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ProjectListItem({ vault }: { vault: any }) {
  const hasImage = vault.metadata?.image;

  return (
    <Link href={`/certs/${vault.id}`}>
      <Card className="hover:shadow-md transition-shadow overflow-hidden group">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-64 aspect-[16/9] sm:aspect-auto overflow-hidden bg-muted relative flex-shrink-0">
            {hasImage ? (
              <img
                src={`${vault.metadata.image}?auto=compress%2Cformat&w=400`}
                alt={vault.metadata?.title || "Project"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {vault.metadata?.title || "Untitled Project"}
                  </h3>
                  {vault.metadata?.pathway && (
                    <Badge variant="secondary">{vault.metadata.pathway}</Badge>
                  )}
                </div>

                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {vault.metadata?.description || "No description available"}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  {vault.metadata?.region && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {vault.metadata.region}
                    </div>
                  )}
                  {vault.metadata?.budget && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />$
                      {(vault.metadata.budget / 1000).toFixed(0)}K Budget
                    </div>
                  )}
                </div>
              </div>

              <Button variant="ghost" className="flex-shrink-0">
                View Project
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
