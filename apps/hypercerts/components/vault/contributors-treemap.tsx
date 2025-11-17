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
import { formatMoney } from "@/lib/format";

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

const defaultMargin = { top: 2, left: 2, right: 2, bottom: 2 };

interface ContributorsTreemapProps {
  id: Address;
}

interface SingleTreemapProps {
  width: number;
  height: number;
  nodes: TreemapNode[];
  tileMethod: string;
  title: string;
  color: string;
  formatAsCurrency?: boolean;
  margin?: { top: number; right: number; bottom: number; left: number };
}

function SingleTreemap({
  width,
  height,
  nodes,
  tileMethod,
  title,
  color,
  formatAsCurrency = false,
  margin = defaultMargin,
}: SingleTreemapProps) {
  if (nodes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-12">
        No {title.toLowerCase()} yet
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
    range: [color, color],
  });

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom - 50; // Extra space for title
  const root = hierarchy(data).sort((a, b) => (b.value || 0) - (a.value || 0));

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <svg width={width} height={height} className="">
      <rect width={width} height={height} rx={8} fill={background} />

      {/* Title */}
      <text
        x={width / 2}
        y={25}
        textAnchor="middle"
        fill="white"
        fontSize={16}
        fontWeight="bold"
      >
        {title}
      </text>
      <text
        x={width / 2}
        y={43}
        textAnchor="middle"
        fill="white"
        fontSize={12}
        opacity={0.7}
      >
        {nodes.length} {nodes.length === 1 ? "person" : "people"}
      </text>

      <Treemap<typeof data>
        top={margin.top + 50}
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

                // Only render leaf nodes (skip root)
                if (node.depth === 0) return null;

                return (
                  <Group
                    key={`node-${i}`}
                    top={node.y0 + margin.top + 50}
                    left={node.x0 + margin.left}
                  >
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
                          ? formatAsCurrency
                            ? `${formatAddress(nodeData.address)}\nValue: ${formatUnits(BigInt(node.value ?? 0), 18)} USDC`
                            : `${formatAddress(nodeData.address)}\nShares: ${formatUnits(BigInt(node.value ?? 0), 18)}`
                          : ""}
                      </title>
                    </rect>
                    {nodeWidth > 60 && nodeHeight > 30 && nodeData.address && (
                      <>
                        <text
                          x={nodeWidth / 2}
                          y={nodeHeight / 2 - 4}
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
                          y={nodeHeight / 2 + 14}
                          textAnchor="middle"
                          fill="white"
                          fontSize={11}
                          pointerEvents="none"
                        >
                          {formatAsCurrency
                            ? formatMoney(
                                Number(
                                  formatUnits(BigInt(node.value ?? 0), 18)
                                ),
                                "USD",
                                0
                              )
                            : `${Number(formatUnits(BigInt(node.value ?? 0), 18)).toLocaleString()} shares`}
                        </text>
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
  const [tileMethod, setTileMethod] = useState<string>("treemapBinary");
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

  // Build separate tree structures for contributors and funders
  const buildContributorsTree = (): TreemapNode[] => {
    const nodes: TreemapNode[] = [{ id: "root", parent: undefined }];

    contributorsData?.items?.forEach((contributor, idx) => {
      const shares = Number(contributor.shares) || 0;
      if (shares > 0) {
        nodes.push({
          id: `depositor-${idx}`,
          parent: "root",
          size: shares,
          address: contributor.address,
          type: "depositor",
        });
      }
    });

    return nodes;
  };

  const buildFundersTree = (): TreemapNode[] => {
    const nodes: TreemapNode[] = [{ id: "root", parent: undefined }];

    fundersData?.items?.forEach((funder, idx) => {
      const assets = Number(funder.assets) || 0;
      if (assets > 0) {
        nodes.push({
          id: `funder-${idx}`,
          parent: "root",
          size: assets,
          address: funder.address,
          type: "funder",
        });
      }
    });

    return nodes;
  };

  const contributorsNodes = buildContributorsTree();
  const fundersNodes = buildFundersTree();

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Contributors & Funders</CardTitle>
        <CardDescription>
          Visual representation of all contributors and funders by contribution
          size
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Funders Treemap */}
          <div className="w-full" style={{ height: "400px" }}>
            <ParentSize>
              {({ width, height }) =>
                fundersNodes.length > 1 ? (
                  <SingleTreemap
                    width={width}
                    height={height}
                    nodes={fundersNodes}
                    tileMethod={tileMethod}
                    title="FUNDERS"
                    color={color2}
                    formatAsCurrency={true}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-12">
                    No funders yet
                  </div>
                )
              }
            </ParentSize>
          </div>
          {/* Contributors Treemap */}
          <div className="w-full" style={{ height: "400px" }}>
            <ParentSize>
              {({ width, height }) =>
                contributorsNodes.length > 1 ? (
                  <SingleTreemap
                    width={width}
                    height={height}
                    nodes={contributorsNodes}
                    tileMethod={tileMethod}
                    title="CONTRIBUTORS"
                    color={color1}
                    formatAsCurrency={false}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-12">
                    No contributors yet
                  </div>
                )
              }
            </ParentSize>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
