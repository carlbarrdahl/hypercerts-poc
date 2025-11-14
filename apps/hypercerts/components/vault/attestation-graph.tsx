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
import { truncate } from "@/lib/truncate";
import { timeAgo } from "@/lib/format";
import { AttestationDialog } from "./attestations";

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
  const typeColor =
    parsed?.type === "milestone"
      ? "bg-blue-50 border-blue-200"
      : parsed?.type === "verification"
        ? "bg-green-50 border-green-200"
        : "bg-gray-50 border-gray-200";

  const selectedStyles = selected
    ? "ring-4 ring-blue-400 ring-offset-2 shadow-lg scale-105"
    : "";

  const metadata = JSON.parse(data.decodedParsed.metadata);

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${typeColor} shadow-sm w-[250px] cursor-pointer hover:shadow-md transition-all ${selectedStyles}`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
        {parsed?.type || "Unknown"}
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

    // Create a map of attestations by ID for quick lookup
    const attestationMap = new Map(data.items.map((item) => [item.id, item]));

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
      // Add attestation nodes with selected state
      ...data.items.map((item) => ({
        id: item.id,
        type: "attestation",
        data: item,
        position: { x: 0, y: 0 }, // Will be set by dagre
        selected: item.id === selectedNodeId,
      })),
    ];

    // Build edges using refUID
    const edges: Edge[] = data.items.map((item) => {
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
  }, [data, selectedNodeId, id, vault]);

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
          <CardTitle>Attestation Graph</CardTitle>
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
        <AttestationDialog
          attestation={selectedAttestation}
          vaultId={id}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
