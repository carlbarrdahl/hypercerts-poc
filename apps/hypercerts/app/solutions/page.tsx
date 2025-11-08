import { oneEarthFramework } from "@workspace/solutions";
import { pathwayImages } from "@/data/pathway-images";
import { generatePathwaySlug } from "@/lib/pathway-utils";
import {
  Zap,
  Leaf,
  Sprout,
  Globe,
  Users,
  Scale,
  BookOpen,
  Lightbulb,
  Gavel,
  HeartHandshake,
  Target,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";

const pillarIcons = {
  "energy-transition": Zap,
  "nature-conservation": Leaf,
  "regenerative-agriculture": Sprout,
};

const leverIcons = {
  "philanthro-activism": HeartHandshake,
  finance: Target,
  "policy-governance": Gavel,
  "science-tech": Lightbulb,
  "legal-empowerment": Scale,
  "community-action": Users,
  "education-culture": BookOpen,
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground mb-4">
                <Globe className="w-4 h-4" />
                <span>OneEarth Solutions Framework</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                Pathways to a
                <br />
                <span className="text-muted-foreground">
                  Regenerative Future
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A comprehensive framework for climate and nature solutions
                organized across three pillars, supported by intersectional
                themes and levers of change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Overview */}
      <section className="py-16 border-b border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {oneEarthFramework.pillars.map((pillar) => {
              const Icon = pillarIcons[pillar.id as keyof typeof pillarIcons];
              const totalPathways = pillar.subPillars.reduce(
                (acc, sp) => acc + sp.pathways.length,
                0
              );
              return (
                <div
                  key={pillar.id}
                  className="group p-6 bg-background border border-border rounded-lg hover:border-foreground/20 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-foreground/5 rounded-lg group-hover:bg-foreground/10 transition-colors">
                      {Icon && <Icon className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold">{pillar.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {pillar.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <span>
                          {pillar.subPillars.length} sub-pillar
                          {pillar.subPillars.length !== 1 ? "s" : ""}
                        </span>
                        <span>•</span>
                        <span>{totalPathways} pathways</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Pathways - Flattened */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              All Solution Pathways
            </h2>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Explore all{" "}
              {oneEarthFramework.pillars.reduce(
                (acc, pillar) =>
                  acc +
                  pillar.subPillars.reduce(
                    (sum, sp) => sum + sp.pathways.length,
                    0
                  ),
                0
              )}{" "}
              pathways across the three pillars of action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oneEarthFramework.pillars.flatMap((pillar) =>
              pillar.subPillars.flatMap((subPillar) =>
                subPillar.pathways.map((pathway) => {
                  const imageUrl = pathwayImages[pathway.name];
                  const slug = generatePathwaySlug(pathway.name);
                  const PillarIcon =
                    pillarIcons[pillar.id as keyof typeof pillarIcons];

                  return (
                    <Link
                      key={pathway.id}
                      href={`/solutions/${slug}`}
                      className="group bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-all duration-200 hover:shadow-md block"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={`${imageUrl}?auto=compress%2Cformat&w=600`}
                            alt={pathway.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-8">
                            {PillarIcon && (
                              <PillarIcon className="w-12 h-12 opacity-30" />
                            )}
                            <ImageIcon className="w-6 h-6 opacity-20" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        {/* Pillar and Sub-Pillar Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-foreground/5 text-foreground rounded-full text-xs font-medium">
                            {PillarIcon && <PillarIcon className="w-3 h-3" />}
                            {pillar.name}
                          </span>
                          <span className="px-2.5 py-1 bg-muted/50 text-muted-foreground rounded-full text-xs">
                            {subPillar.name}
                          </span>
                        </div>

                        <h4 className="font-semibold mb-2 text-sm leading-tight group-hover:text-muted-foreground transition-colors">
                          {pathway.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                          {pathway.summary}
                        </p>
                        {(pathway.relatedThemes || pathway.relatedLevers) && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                            {pathway.relatedThemes?.map((theme) => (
                              <span
                                key={theme}
                                className="px-2 py-1 bg-foreground/5 text-foreground rounded-full text-xs"
                              >
                                {theme}
                              </span>
                            ))}
                            {pathway.relatedLevers?.map((lever) => (
                              <span
                                key={lever}
                                className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                              >
                                {lever}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })
              )
            )}
          </div>
        </div>
      </section>

      {/* Intersectional Themes */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Intersectional Themes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Cross-cutting themes that ensure solutions address equity,
              justice, and multiple co-benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oneEarthFramework.intersectionalThemes.map((theme) => (
              <div
                key={theme.id}
                className="p-5 bg-background border border-border rounded-lg hover:border-foreground/20 transition-colors"
              >
                <h3 className="font-semibold mb-2">{theme.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levers of Change */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Levers of Change
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Key mechanisms and strategies to accelerate and scale solutions
              across all pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {oneEarthFramework.leversOfChange.map((lever) => {
              const Icon =
                leverIcons[lever.id as keyof typeof leverIcons] || Target;
              return (
                <div
                  key={lever.id}
                  className="p-6 bg-background border border-border rounded-lg hover:border-foreground/20 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-foreground/5 rounded-lg group-hover:bg-foreground/10 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-lg flex-1">
                      {lever.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lever.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Explore Vaults</h2>
            <p className="text-muted-foreground">
              See how these solutions are being implemented through impact vaults
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/" className="group">
                <div className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors duration-200">
                  <span className="text-sm font-medium">View Vaults</span>
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

