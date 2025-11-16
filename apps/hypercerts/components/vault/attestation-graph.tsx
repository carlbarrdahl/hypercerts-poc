"use client";

import React, { useCallback, useMemo, useEffect, useState } from "react";
import { Address } from "viem";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  Handle,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { useHypercertsAttestations, useHypercerts } from "@workspace/sdk";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { truncate } from "@/lib/truncate";
import { timeAgo } from "@/lib/format";
import { AttestationSheet } from "./attestations";
import { Download, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import "@xyflow/react/dist/style.css";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 80;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: 100, // Vertical spacing between ranks
    nodesep: 50, // Horizontal spacing between nodes
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

function VaultNode({ data, selected }: { data: any; selected?: boolean }) {
  const selectedStyles = selected
    ? "ring-4 ring-purple-400 ring-offset-2 shadow-lg scale-105"
    : "";

  const projectName = data.vault?.metadata?.title || "Untitled Project";

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-purple-50 border-purple-300 shadow-md w-[250px] cursor-pointer hover:shadow-lg transition-all ${selectedStyles}`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-1">
        Vault / Project
      </div>
      <div
        className="text-sm font-medium text-gray-900 mb-1 truncate"
        title={projectName}
      >
        {projectName}
      </div>
      <div className="text-xs text-gray-500 font-mono">{truncate(data.id)}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function AttestationNode({
  data,
  selected,
}: {
  data: any;
  selected?: boolean;
}) {
  const parsed = data.decodedParsed as any;
  const metadata = JSON.parse(data.decodedParsed.metadata);

  const isMilestone = parsed?.type === "milestone";
  const isVerification = parsed?.type === "verification";
  const isWorkClaim = parsed?.type === "work-claim";
  const isVerified = metadata?.verified === true;

  // Color coding based on type and verification status
  let typeColor = "bg-gray-50 border-gray-200";
  let badgeColor = "bg-gray-500";

  if (isMilestone) {
    typeColor = "bg-blue-50 border-blue-300";
    badgeColor = "bg-blue-500";
  } else if (isVerification) {
    typeColor = isVerified
      ? "bg-green-50 border-green-300"
      : "bg-red-50 border-red-300";
    badgeColor = isVerified ? "bg-green-500" : "bg-red-500";
  } else if (isWorkClaim) {
    typeColor = "bg-purple-50 border-purple-200";
    badgeColor = "bg-purple-500";
  }

  const selectedStyles = selected
    ? "ring-4 ring-blue-400 ring-offset-2 shadow-lg scale-105"
    : "";

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${typeColor} shadow-sm w-[250px] cursor-pointer hover:shadow-md transition-all ${selectedStyles}`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
          {parsed?.type || "Unknown"}
        </div>
        {data.verificationCount > 0 && (
          <Badge
            variant="secondary"
            className={`text-xs ${badgeColor} text-white`}
          >
            {data.verificationCount} ✓
          </Badge>
        )}
      </div>
      <div className="text-sm font-medium text-gray-900 mb-1">
        {metadata?.title || "Untitled"}
      </div>
      <div className="text-xs text-gray-500 font-mono">{truncate(data.id)}</div>
      <div className="text-xs text-gray-400 mt-1">
        {timeAgo(data.createdAt)}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  vault: VaultNode,
  attestation: AttestationNode,
};

function Flow({
  nodes,
  edges,
  onNodeClick,
  selectedNodeId,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (node: Node) => void;
  selectedNodeId: string | null;
}) {
  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Update internal state when props change (new data arrives)
  // The nodes already have the selected state from the parent
  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep }, eds)
      ),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={(_, node) => onNodeClick(node)}
      connectionLineType={ConnectionLineType.SmoothStep}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
      maxZoom={2}
    >
      <Background />
    </ReactFlow>
  );
}

export function AttestationGraph({ id }: { id: Address }) {
  const [selectedAttestation, setSelectedAttestation] = useState<any | null>(
    null
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    milestone: true,
    workClaim: true,
    verification: true,
    verifiedOnly: false,
  });
  const { sdk } = useHypercerts();

  const { data: vault } = useQuery({
    queryKey: ["vault", id],
    queryFn: () => sdk?.vault.query({ where: { id }, limit: 1 }) ?? null,
    select: (data) => data?.items?.[0],
  });

  const { data, isPending } = useHypercertsAttestations(
    {
      orderBy: "createdAt",
      orderDirection: "desc",
      where: {
        recipient: id,
      },
    },
    {
      refetchInterval: 5000,
    }
  );
  const handleNodeClick = useCallback((node: Node) => {
    // Only show dialog for attestation nodes, not vault nodes
    if (node.type === "attestation") {
      setSelectedAttestation(node.data);
    }
    setSelectedNodeId(node.id);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedAttestation(null);
    setSelectedNodeId(null);
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (!data?.items?.length) {
      return { nodes: [], edges: [] };
    }

    // Filter attestations based on selected filters
    let filteredItems = data.items.filter((item) => {
      const parsed = item.decodedParsed as any;
      const type = parsed?.type;

      // Type filtering
      if (type === "milestone" && !filters.milestone) return false;
      if (type === "work-claim" && !filters.workClaim) return false;
      if (type === "verification" && !filters.verification) return false;

      // Verified-only filter
      if (filters.verifiedOnly && type === "verification") {
        const metadata = JSON.parse(parsed.metadata);
        if (!metadata?.verified) return false;
      }

      return true;
    });

    // Count verifications for each attestation
    const verificationCounts = new Map<string, number>();
    data.items.forEach((item) => {
      const parsed = item.decodedParsed as any;
      if (parsed?.type === "verification" && item.refUID) {
        const metadata = JSON.parse(parsed.metadata);
        if (metadata?.verified) {
          verificationCounts.set(
            item.refUID,
            (verificationCounts.get(item.refUID) || 0) + 1
          );
        }
      }
    });

    // Create a map of attestations by ID for quick lookup
    const attestationMap = new Map(
      filteredItems.map((item) => [item.id, item])
    );

    // Add root vault node
    const rootNodeId = `vault-${id}`;
    const nodes: Node[] = [
      {
        id: rootNodeId,
        type: "vault",
        data: { id, vault },
        position: { x: 0, y: 0 }, // Will be set by dagre
        selected: rootNodeId === selectedNodeId,
      },
      // Add attestation nodes with verification counts
      ...filteredItems.map((item) => ({
        id: item.id,
        type: "attestation",
        data: {
          ...item,
          verificationCount: verificationCounts.get(item.id) || 0,
        },
        position: { x: 0, y: 0 }, // Will be set by dagre
        selected: item.id === selectedNodeId,
      })),
    ];

    // Build edges using refUID
    const edges: Edge[] = filteredItems.map((item) => {
      // If attestation has a valid refUID that points to another attestation, connect them
      if (
        item.refUID &&
        item.refUID !==
          "0x0000000000000000000000000000000000000000000000000000000000000000" &&
        attestationMap.has(item.refUID)
      ) {
        return {
          id: `${item.refUID}-${item.id}`,
          source: item.refUID,
          target: item.id,
          type: ConnectionLineType.SmoothStep,
        };
      }
      // Otherwise, connect to the root vault node
      return {
        id: `${rootNodeId}-${item.id}`,
        source: rootNodeId,
        target: item.id,
        type: ConnectionLineType.SmoothStep,
      };
    });

    // Apply dagre layout
    return getLayoutedElements(nodes, edges, "TB");
  }, [data, selectedNodeId, id, vault, filters]);

  const handleExport = () => {
    // Create a simple text-based export for now
    const exportData = {
      vault: id,
      timestamp: new Date().toISOString(),
      attestations: data?.items || [],
      filters,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attestation-graph-${id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isPending) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Attestation Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            Loading attestations...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.items?.length) {
    return null;
  }

  if (nodes.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attestation Graph</CardTitle>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Show Types</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.milestone}
                    onCheckedChange={(checked) =>
                      setFilters((f) => ({ ...f, milestone: checked }))
                    }
                  >
                    Milestones
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.workClaim}
                    onCheckedChange={(checked) =>
                      setFilters((f) => ({ ...f, workClaim: checked }))
                    }
                  >
                    Work Claims
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.verification}
                    onCheckedChange={(checked) =>
                      setFilters((f) => ({ ...f, verification: checked }))
                    }
                  >
                    Verifications
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Additional Filters</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.verifiedOnly}
                    onCheckedChange={(checked) =>
                      setFilters((f) => ({ ...f, verifiedOnly: checked }))
                    }
                  >
                    Verified Only
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: "600px" }}>
            <Flow
              nodes={nodes}
              edges={edges}
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNodeId}
            />
          </div>
        </CardContent>
      </Card>
      {selectedAttestation && (
        <AttestationSheet
          attestation={selectedAttestation}
          vaultId={id}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
