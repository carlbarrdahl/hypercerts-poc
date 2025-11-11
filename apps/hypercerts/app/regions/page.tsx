"use client";

import { useListHypercerts } from "@workspace/sdk";
import { MapPin, Coins, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegionsPage() {
  const { data: regionsData, isLoading } = useListHypercerts(
    {
      // where: { type: "bioregion" },
      limit: 100,
      orderBy: "createdAt",
      orderDirection: "desc",
    },
    { refetchInterval: 5000 }
  );

  const regions = regionsData?.items || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>Impact Regions</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                Active Impact Regions
                <br />
                <span className="text-muted-foreground">Around the World</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Explore regions where verified impact vaults are funding
                regenerative solutions on the ground.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions List */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading regions...</span>
              </div>
            </div>
          ) : regions.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No regions yet</h3>
              <p className="text-muted-foreground mb-8">
                Be the first to create an impact region vault
              </p>
              <Link href="/" className="group inline-flex items-center gap-2">
                <div className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors duration-200">
                  <span className="text-sm font-medium">Go to Home</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  {regions.length} {regions.length === 1 ? "Region" : "Regions"}
                </h2>
                <p className="text-muted-foreground">
                  Click on a region to view details and contribute to its impact
                  vault
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
                            <h3 className="font-semibold text-base mb-2 group-hover:text-muted-foreground transition-colors">
                              {region.metadata?.title ||
                                `Region ${region.id.slice(0, 8)}...`}
                            </h3>
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <span className="font-mono">
                                  {region.id.slice(0, 10)}...
                                </span>
                              </div>
                              {region.createdAt && (
                                <div>
                                  Created{" "}
                                  {new Date(
                                    region.createdAt
                                  ).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {region.token && (
                          <div className="pt-3 border-t border-border space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Coins className="w-3.5 h-3.5" />
                              <span>Active vault</span>
                            </div>
                          </div>
                        )}

                        {region.parent && (
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                              Nested vault
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {regions.length > 0 && (
        <section className="py-16 border-t border-border bg-muted/20">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Want to explore solutions?
              </h2>
              <p className="text-muted-foreground">
                Discover the solution pathways these regions are implementing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/solutions" className="group">
                  <div className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors duration-200">
                    <span className="text-sm font-medium">View Solutions</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
