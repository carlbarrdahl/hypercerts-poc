"use client";

import { oneEarthFramework } from "@workspace/oneearth";
import { useListHypercerts } from "@workspace/sdk";
import { generatePathwaySlug } from "@/lib/pathway-utils";
import { pathwayImages } from "@/data/pathway-images";
import {
  Sparkles,
  Leaf,
  Zap,
  Sprout,
  Globe,
  ArrowRight,
  Target,
  Coins,
  ImageIcon,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const pillarIcons = {
  "energy-transition": Zap,
  "nature-conservation": Leaf,
  "regenerative-agriculture": Sprout,
};

export default function Page() {
  // Query regions (vaults) from the SDK
  const { data: regionsData } = useListHypercerts(
    {
      where: { type: "bioregion" },
      limit: 6,
      orderBy: "createdAt",
      orderDirection: "desc",
    },
    { refetchInterval: 5000 }
  );

  const regions = regionsData?.items || [];

  // Get featured solution pathways
  const featuredPathways = oneEarthFramework.pillars
    .flatMap((pillar) =>
      pillar.subPillars.flatMap((subPillar) =>
        subPillar.pathways.map((pathway) => ({
          ...pathway,
          pillarId: pillar.id,
          pillarName: pillar.name,
          subPillarName: subPillar.name,
        }))
      )
    )
    .slice(0, 6);

  // Calculate total pathways
  const totalPathways = oneEarthFramework.pillars.reduce(
    (acc, pillar) =>
      acc + pillar.subPillars.reduce((sum, sp) => sum + sp.pathways.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background pointer-events-none" />
        <div className="max-w-6xl mx-auto px-8 py-24 md:py-32 relative">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full text-sm text-muted-foreground mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Impact Certification Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                Fund Climate Action
                <br />
                <span className="text-muted-foreground">
                  Through Verified Impact
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Support regenerative solutions worldwide through impact vaults
                that certify and reward verified contributions to climate and
                nature restoration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/explore" className="group">
                <div className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">Explore All</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
              <Link href="/solutions" className="group">
                <div className="flex items-center gap-2 px-6 py-3 border border-border rounded-full hover:bg-muted/50 transition-colors duration-200">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">View Solutions</span>
                </div>
              </Link>
              <Link href="/regions" className="group">
                <div className="flex items-center gap-2 px-6 py-3 border border-border rounded-full hover:bg-muted/50 transition-colors duration-200">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Browse Regions</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Climate Pillars */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Three Pillars of Climate Action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive framework for funding solutions across energy,
              nature, and agriculture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {oneEarthFramework.pillars.map((pillar) => {
              const Icon = pillarIcons[pillar.id as keyof typeof pillarIcons];
              const pathwayCount = pillar.subPillars.reduce(
                (acc, sp) => acc + sp.pathways.length,
                0
              );
              return (
                <div
                  key={pillar.id}
                  className="group p-6 bg-background border border-border rounded-lg hover:border-foreground/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-foreground/5 rounded-lg group-hover:bg-foreground/10 transition-colors">
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {pillar.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        {pathwayCount} solution pathways
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Solutions */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Featured Solution Pathways
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover proven approaches to climate and nature restoration ready
              to be funded through impact vaults.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPathways.map((pathway) => {
              const imageUrl = pathwayImages[pathway.name];
              const slug = generatePathwaySlug(pathway.name);
              const PillarIcon =
                pillarIcons[pathway.pillarId as keyof typeof pillarIcons];

              return (
                <Link
                  key={pathway.id}
                  href={`/solutions/${slug}`}
                  className="group block"
                >
                  <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 hover:shadow-lg transition-all duration-200">
                    <div className="aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={`${imageUrl}?auto=compress%2Cformat&w=600`}
                          alt={pathway.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          {PillarIcon && (
                            <PillarIcon className="w-12 h-12 opacity-30" />
                          )}
                          <ImageIcon className="w-6 h-6 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-foreground/5 text-foreground rounded-full text-xs font-medium">
                          {PillarIcon && <PillarIcon className="w-3 h-3" />}
                          {pathway.pillarName}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-muted-foreground transition-colors">
                        {pathway.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {pathway.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center pt-12">
            <Link
              href="/solutions"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              View all {totalPathways} solution pathways
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Active Regions */}
      {regions.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
                Active Impact Regions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Explore regions where verified impact vaults are funding
                regenerative solutions on the ground.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <Link
                  key={region.id}
                  href={`/regions/${region.id}`}
                  className="group block"
                >
                  <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 hover:shadow-lg transition-all duration-200 h-full">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-foreground/5 rounded-lg group-hover:bg-foreground/10 transition-colors">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-2 group-hover:text-muted-foreground transition-colors truncate">
                            {region.metadata ||
                              `Region ${region.id.slice(0, 8)}...`}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>ID: {region.id.slice(0, 10)}...</span>
                          </div>
                        </div>
                      </div>
                      {region.token && (
                        <div className="pt-3 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Coins className="w-3.5 h-3.5" />
                            <span>Active vault</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center pt-12">
              <Link
                href="/regions"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                View all regions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 border-t border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl tracking-tight">
              Ready to Make an Impact?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Fund verified climate solutions through impact vaults or create
              your own to certify and reward regenerative action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/solutions" className="group">
                <div className="flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <span className="font-medium">Explore Solutions</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
