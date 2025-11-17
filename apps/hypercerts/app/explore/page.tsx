"use client";

import { useListHypercerts } from "@workspace/sdk";
import {
  MapPin,
  Zap,
  Leaf,
  Sprout,
  Globe,
  ArrowRight,
  Loader2,
  ImageIcon,
  Target,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";

const pillarIcons = {
  "energy-transition": Zap,
  "nature-conservation": Leaf,
  "regenerative-agriculture": Sprout,
};

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all vaults
  const { data: vaultsData, isLoading } = useListHypercerts({
    limit: 100,
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  // Separate vaults by type
  const pathways = (vaultsData?.items || []).filter(
    (item) => item.metadata?.type === "pathway"
  );

  const regions = (vaultsData?.items || []).filter(
    (item) => item.metadata?.type === "region"
  );

  const projects = (vaultsData?.items || []).filter(
    (item) => item.metadata?.type === "project"
  );

  // Filter function
  const filterBySearch = (items: any[], getTitle: (item: any) => string) => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      getTitle(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPathways = filterBySearch(
    pathways,
    (p) => p.metadata?.title || ""
  );
  const filteredRegions = filterBySearch(
    regions,
    (r) => r.metadata?.title || ""
  );
  const filteredProjects = filterBySearch(
    projects,
    (p) => p.metadata?.title || ""
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Impact Explorer</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Explore Climate Solutions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover pathways, regions, and projects creating regenerative
              impact around the world
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search solutions, regions, or projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {isLoading ? "..." : pathways.length}
              </div>
              <div className="text-sm text-muted-foreground">Solutions</div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-3xl font-bold">
                {isLoading ? "..." : regions.length}
              </div>
              <div className="text-sm text-muted-foreground">Regions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {isLoading ? "..." : projects.length}
              </div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="solutions">Solutions</TabsTrigger>
              <TabsTrigger value="regions">Regions</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            {/* All Tab */}
            <TabsContent value="all" className="space-y-16">
              {/* Solutions Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Solution Pathways</h2>
                    <p className="text-muted-foreground">
                      {filteredPathways.length} pathways available
                    </p>
                  </div>
                  <Link href="/solutions" className="group">
                    <div className="flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors">
                      View All
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
                {isLoading ? (
                  <LoadingGrid />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredPathways.slice(0, 4).map((pathway) => (
                      <PathwayCard key={pathway.id} pathway={pathway} />
                    ))}
                  </div>
                )}
              </div>

              {/* Regions Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Impact Regions</h2>
                    <p className="text-muted-foreground">
                      {filteredRegions.length} regions active
                    </p>
                  </div>
                  <Link href="/regions" className="group">
                    <div className="flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors">
                      View All
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
                {isLoading ? (
                  <LoadingGrid />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredRegions.slice(0, 4).map((region) => (
                      <RegionCard key={region.id} region={region} />
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Active Projects</h2>
                    <p className="text-muted-foreground">
                      {filteredProjects.length} projects funded
                    </p>
                  </div>
                  <Link href="/certs" className="group">
                    <div className="flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors">
                      View All
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
                {isLoading ? (
                  <LoadingGrid />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredProjects.slice(0, 8).map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Solutions Tab */}
            <TabsContent value="solutions">
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredPathways.length} solution pathways
                </p>
              </div>
              {isLoading ? (
                <LoadingGrid />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredPathways.map((pathway) => (
                    <PathwayCard key={pathway.id} pathway={pathway} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Regions Tab */}
            <TabsContent value="regions">
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredRegions.length} impact regions
                </p>
              </div>
              {isLoading ? (
                <LoadingGrid />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredRegions.map((region) => (
                    <RegionCard key={region.id} region={region} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredProjects.length} active projects
                </p>
              </div>
              {isLoading ? (
                <LoadingGrid />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function PathwayCard({ pathway }: { pathway: any }) {
  const metadata = pathway.metadata as Record<string, any>;
  const title = metadata?.title || "Untitled Solution";
  const image = metadata?.image;
  const pathwayId = metadata?.pathwayId;

  return (
    <Link
      href={`/certs/${pathway.id}`}
      className="group block bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all duration-200"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        {image ? (
          <img
            src={`${image}?auto=compress%2Cformat&w=400`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Target className="w-10 h-10 text-muted-foreground/20" />
          </div>
        )}
        {pathwayId && (
          <Badge className="absolute top-2 right-2 text-xs">{pathwayId}</Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Target className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Solution</span>
        </div>
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-muted-foreground transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function RegionCard({ region }: { region: any }) {
  const metadata = region.metadata as Record<string, any>;
  const title = metadata?.title || `Region ${region.id.slice(0, 8)}...`;
  const image = metadata?.image;
  const regionId = metadata?.regionId;

  return (
    <Link
      href={`/regions/${region.id}`}
      className="group block bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all duration-200"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        {image ? (
          <img
            src={`${image}?auto=compress%2Cformat&w=400`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-muted-foreground/20" />
          </div>
        )}
        {regionId && (
          <Badge className="absolute top-2 right-2 text-xs">{regionId}</Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Impact Region</span>
        </div>
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-muted-foreground transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function ProjectCard({ project }: { project: any }) {
  const metadata = project.metadata as Record<string, any>;
  const title = metadata?.title || "Untitled Project";
  const image = metadata?.image;
  const pathway = metadata?.pathway;
  const region = metadata?.region;

  return (
    <Link
      href={`/certs/${project.id}`}
      className="group block bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all duration-200"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        {image ? (
          <img
            src={`${image}?auto=compress%2Cformat&w=400`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-muted-foreground/20" />
          </div>
        )}
        {pathway && (
          <Badge className="absolute top-2 right-2 text-xs">{pathway}</Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Target className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {region || "Project"}
          </span>
        </div>
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-muted-foreground transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-background border border-border rounded-lg overflow-hidden"
        >
          <div className="aspect-[4/3] bg-muted animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
