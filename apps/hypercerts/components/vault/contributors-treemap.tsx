"use client";

import { useState } from "react";
import { Group } from "@visx/group";
import {
  Treemap,
  hierarchy,
  stratify,
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
} from "@visx/hierarchy";
import { scaleLinear } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { Address, formatUnits } from "viem";
import { useListContributors, useListFunders } from "@workspace/sdk";
import { useQuery } from "@tanstack/react-query";
import { useHypercerts } from "@workspace/sdk";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";

const color1 = "#22c55e";
const color2 = "#3b82f6";
const background = "#18181b";
const borderColor = "#27272a";

interface TreemapNode {
  id: string;
  parent?: string;
  size?: number;
  address?: string;
  type?: "depositor" | "funder";
}

const tileMethods: Record<string, any> = {
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
};

const defaultMargin = { top: 10, left: 10, right: 10, bottom: 10 };

interface ContributorsTreemapProps {
  id: Address;
}

interface TreemapVisualizationProps {
  width: number;
  height: number;
  nodes: TreemapNode[];
  tileMethod: string;
  margin?: { top: number; right: number; bottom: number; left: number };
}

function TreemapVisualization({
  width,
  height,
  nodes,
  tileMethod,
  margin = defaultMargin,
}: TreemapVisualizationProps) {
  if (nodes.length <= 3) {
    return (
      <div className="text-sm text-muted-foreground text-center py-12">
        No contributors or funders data available yet.
      </div>
    );
  }

  const data = stratify<TreemapNode>()
    .id((d) => d.id)
    .parentId((d) => d.parent)(nodes)
    .sum((d) => d.size ?? 0);

  const maxValue = Math.max(...nodes.filter((d) => d.size).map((d) => d.size!));

  const colorScale = scaleLinear<string>({
    domain: [0, maxValue],
    range: [color2, color2],
  });

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const root = hierarchy(data).sort((a, b) => (b.value || 0) - (a.value || 0));

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <svg width={width} height={height} className="rounded-lg">
      <rect width={width} height={height} rx={8} fill={background} />
      <Treemap<typeof data>
        top={margin.top}
        root={root}
        size={[xMax, yMax]}
        tile={tileMethods[tileMethod]}
        round
      >
        {(treemap) => (
          <Group>
            {treemap
              .descendants()
              .reverse()
              .map((node, i) => {
                const nodeWidth = node.x1 - node.x0;
                const nodeHeight = node.y1 - node.y0;
                const nodeData = node.data.data as TreemapNode;

                return (
                  <Group
                    key={`node-${i}`}
                    top={node.y0 + margin.top}
                    left={node.x0 + margin.left}
                  >
                    {/* Render category borders (depositors/funders groups) */}
                    {node.depth === 1 && (
                      <rect
                        width={nodeWidth}
                        height={nodeHeight}
                        stroke={background}
                        strokeWidth={4}
                        fill="transparent"
                      />
                    )}
                    {/* Render actual contributor/funder rectangles */}
                    {node.depth === 2 && (
                      <>
                        <rect
                          width={nodeWidth}
                          height={nodeHeight}
                          stroke={background}
                          strokeWidth={2}
                          fill={colorScale(node.value || 0)}
                          className="transition-opacity hover:opacity-80 cursor-pointer"
                        >
                          <title>
                            {nodeData.address
                              ? `${formatAddress(nodeData.address)}\n${
                                  nodeData.type === "depositor"
                                    ? "Depositor"
                                    : "Funder"
                                }\nValue: ${node.value}`
                              : ""}
                          </title>
                        </rect>
                        {nodeWidth > 60 &&
                          nodeHeight > 30 &&
                          nodeData.address && (
                            <>
                              <text
                                x={nodeWidth / 2}
                                y={nodeHeight / 2 - 8}
                                textAnchor="middle"
                                fill="white"
                                fontSize={12}
                                fontWeight="bold"
                                pointerEvents="none"
                              >
                                {formatAddress(nodeData.address)}
                              </text>
                              <text
                                x={nodeWidth / 2}
                                y={nodeHeight / 2 + 8}
                                textAnchor="middle"
                                fill="white"
                                fontSize={10}
                                opacity={0.8}
                                pointerEvents="none"
                              >
                                {nodeData.type === "depositor"
                                  ? "Depositor"
                                  : "Funder"}
                              </text>
                              <text
                                x={nodeWidth / 2}
                                y={nodeHeight / 2 + 24}
                                textAnchor="middle"
                                fill="white"
                                fontSize={11}
                                pointerEvents="none"
                              >
                                {formatUnits(node.value ?? 0, 18)} USDC
                              </text>
                            </>
                          )}
                      </>
                    )}
                  </Group>
                );
              })}
          </Group>
        )}
      </Treemap>
    </svg>
  );
}

export function ContributorsTreemap({ id }: ContributorsTreemapProps) {
  const [tileMethod, setTileMethod] = useState<string>("treemapSquarify");
  const { sdk } = useHypercerts();

  const { data: contributorsData } = useListContributors(
    {
      where: { vault: id },
    },
    {
      refetchInterval: 1000,
    }
  );

  const { data: fundersData } = useListFunders(
    {
      where: { vault: id },
    },
    {
      refetchInterval: 1000,
    }
  );

  const { data: vault } = useQuery({
    queryKey: ["vault", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items[0],
  });

  // Build hierarchical data structure
  const buildTreemapData = (): TreemapNode[] => {
    const nodes: TreemapNode[] = [
      { id: "root", parent: undefined },
      { id: "depositors", parent: "root" },
      { id: "funders", parent: "root" },
    ];

    // Add contributors (depositors with shares)
    contributorsData?.items?.forEach((contributor, idx) => {
      const shares = Number(contributor.shares) || 0;
      if (shares > 0) {
        nodes.push({
          id: `depositor-${idx}`,
          parent: "depositors",
          size: shares,
          address: contributor.address,
          type: "depositor",
        });
      }
    });

    // Add funders (those who fund without shares)
    fundersData?.items?.forEach((funder, idx) => {
      const assets = Number(funder.assets) || 0;
      if (assets > 0) {
        nodes.push({
          id: `funder-${idx}`,
          parent: "funders",
          size: assets,
          address: funder.address,
          type: "funder",
        });
      }
    });

    return nodes;
  };

  const nodes = buildTreemapData();

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Contributors Treemap</CardTitle>
        <CardDescription>
          Visual representation of all contributors and funders by contribution
          size
        </CardDescription>
        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm text-muted-foreground">Tile method:</label>
          <select
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setTileMethod(e.target.value)}
            value={tileMethod}
            className="text-sm bg-background border border-border rounded px-2 py-1"
          >
            {Object.keys(tileMethods).map((tile) => (
              <option key={tile} value={tile}>
                {tile.replace("treemap", "")}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: "500px" }}>
          <ParentSize>
            {({ width, height }) => (
              <TreemapVisualization
                width={width}
                height={height}
                nodes={nodes}
                tileMethod={tileMethod}
              />
            )}
          </ParentSize>
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color2 }}
            />
            <span className="text-muted-foreground">Smaller contributions</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color1 }}
            />
            <span className="text-muted-foreground">Larger contributions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
