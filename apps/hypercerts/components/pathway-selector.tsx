"use client";

import { useState } from "react";
import { oneEarthFramework } from "@/lib/pathway-data";
import { generatePathwaySlug } from "@/lib/pathway-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Zap, Leaf, Sprout, Search } from "lucide-react";
import Link from "next/link";

const pillarIcons = {
  "energy-transition": Zap,
  "nature-conservation": Leaf,
  "regenerative-agriculture": Sprout,
};

export function PathwaySelector({
  onSelect,
  currentPathwaySlug,
}: {
  onSelect: (slug: string) => void;
  currentPathwaySlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allPathways = oneEarthFramework.pillars.flatMap((pillar) =>
    pillar.subPillars.flatMap((subPillar) =>
      subPillar.pathways.map((pathway) => ({
        pathway,
        pillar,
        subPillar,
      }))
    )
  );

  const filteredPathways = allPathways.filter(({ pathway }) =>
    pathway.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (slug: string) => {
    onSelect(slug);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {currentPathwaySlug ? "Change Pathway" : "Link to Pathway"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select a Solution Pathway</DialogTitle>
          <DialogDescription>
            Link this vault to a pathway from the OneEarth Solutions Framework
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pathways..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {filteredPathways.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pathways found matching "{searchQuery}"
              </div>
            ) : (
              filteredPathways.map(({ pathway, pillar, subPillar }) => {
                const slug = generatePathwaySlug(pathway.name);
                const Icon =
                  pillarIcons[pillar.id as keyof typeof pillarIcons];
                const isSelected = currentPathwaySlug === slug;

                return (
                  <div
                    key={pathway.id}
                    className={`p-4 border border-border rounded-lg hover:border-foreground/20 transition-all cursor-pointer ${
                      isSelected ? "bg-muted/50" : ""
                    }`}
                    onClick={() => handleSelect(slug)}
                  >
                    <div className="flex items-start gap-3">
                      {Icon && (
                        <div className="p-2 bg-foreground/5 rounded-lg flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">
                            {pathway.name}
                          </h4>
                          {isSelected && (
                            <span className="text-xs px-2 py-0.5 bg-foreground/10 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {pathway.summary}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-1 bg-foreground/5 rounded-full">
                            {pillar.name}
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted/50 rounded-full">
                            {subPillar.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

