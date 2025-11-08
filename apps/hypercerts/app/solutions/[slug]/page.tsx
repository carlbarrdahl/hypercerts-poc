import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { oneEarthFramework } from "@/data/solutions";
import { pathwayImages } from "@/data/pathway-images";
import { findPathwayBySlug, generatePathwaySlug } from "@/lib/pathway-utils";
import Link from "next/link";
import { ArrowLeft, Zap, Leaf, Sprout, ImageIcon } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = findPathwayBySlug(oneEarthFramework, params.slug);

  if (!result) {
    return {
      title: "Pathway Not Found",
    };
  }

  const { pathway, pillar, subPillar } = result;

  return {
    title: `${pathway.name} | OneEarth Solutions Framework`,
    description: pathway.description || pathway.summary,
  };
}

const pillarIcons = {
  "energy-transition": Zap,
  "nature-conservation": Leaf,
  "regenerative-agriculture": Sprout,
};

export default function PathwayDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const result = findPathwayBySlug(oneEarthFramework, params.slug);

  if (!result) {
    notFound();
  }

  const { pathway, pillar, subPillar } = result;
  const imageUrl = pathwayImages[pathway.name];
  const Icon = pillarIcons[pillar.id as keyof typeof pillarIcons];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Solutions Framework
          </Link>
          <div className="flex items-center gap-3 mb-4">
            {Icon && (
              <div className="p-2 bg-foreground/5 rounded-lg">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="text-sm text-muted-foreground">
                {pillar.name} / {subPillar.name}
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold mt-1">
                {pathway.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-8 bg-muted flex items-center justify-center">
          {imageUrl ? (
            <img
              src={`${imageUrl}?auto=compress%2Cformat&w=1200`}
              alt={pathway.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground p-12">
              {Icon && <Icon className="w-16 h-16 opacity-30" />}
              <ImageIcon className="w-8 h-8 opacity-20" />
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {pathway.description || pathway.summary}
          </p>

          {(pathway.relatedThemes || pathway.relatedLevers) && (
            <div className="space-y-6 mb-12">
              {pathway.relatedThemes && pathway.relatedThemes.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Related Intersectional Themes
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {pathway.relatedThemes.map((theme) => {
                      const themeObj = oneEarthFramework.intersectionalThemes.find(
                        (t) => t.name === theme
                      );
                      return (
                        <div
                          key={theme}
                          className="px-4 py-2 bg-foreground/5 rounded-lg border border-border"
                        >
                          <div className="font-semibold text-sm">{theme}</div>
                          {themeObj && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {themeObj.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {pathway.relatedLevers && pathway.relatedLevers.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Related Levers of Change
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {pathway.relatedLevers.map((lever) => {
                      const leverObj = oneEarthFramework.leversOfChange.find(
                        (l) => l.name === lever
                      );
                      return (
                        <div
                          key={lever}
                          className="px-4 py-2 bg-muted rounded-lg border border-border"
                        >
                          <div className="font-semibold text-sm">{lever}</div>
                          {leverObj && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {leverObj.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related Pathways */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-4">
              Other Pathways in {subPillar.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subPillar.pathways
                .filter((p) => p.id !== pathway.id)
                .slice(0, 4)
                .map((relatedPathway) => {
                  const relatedSlug = generatePathwaySlug(relatedPathway.name);
                  const relatedImageUrl =
                    pathwayImages[relatedPathway.name];
                  return (
                    <Link
                      key={relatedPathway.id}
                      href={`/solutions/${relatedSlug}`}
                      className="group p-4 bg-background border border-border rounded-lg hover:border-foreground/20 transition-all"
                    >
                      {relatedImageUrl && (
                        <div className="aspect-[16/9] overflow-hidden rounded-md mb-3 bg-muted">
                          <img
                            src={`${relatedImageUrl}?auto=compress%2Cformat&w=400`}
                            alt={relatedPathway.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-sm group-hover:text-muted-foreground transition-colors">
                        {relatedPathway.name}
                      </h3>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

