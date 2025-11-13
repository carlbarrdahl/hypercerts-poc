"use client";

import React, { useCallback, useMemo, useEffect } from "react";
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
import { useHypercertsAttestations } from "@workspace/sdk";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { truncate } from "@/lib/truncate";
import { timeAgo } from "@/lib/format";

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

function AttestationNode({ data }: { data: any }) {
  const parsed = data.decodedParsed as any;
  const typeColor =
    parsed?.type === "milestone"
      ? "bg-blue-50 border-blue-200"
      : parsed?.type === "verification"
        ? "bg-green-50 border-green-200"
        : "bg-gray-50 border-gray-200";
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${typeColor} shadow-sm min-w-[250px]`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
        {parsed?.type || "Unknown"}
      </div>
      <div className="text-sm font-medium text-gray-900 mb-1">
        {data?.metadata?.title || "Untitled"}
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
  attestation: AttestationNode,
};

function Flow({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Update internal state when props change (new data arrives)
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

  const { nodes, edges } = useMemo(() => {
    if (!data?.items?.length) {
      return { nodes: [], edges: [] };
    }

    // Create a map of attestations by ID for quick lookup
    const attestationMap = new Map(data.items.map((item) => [item.id, item]));

    // Build nodes
    const nodes: Node[] = data.items.map((item) => ({
      id: item.id,
      type: "attestation",
      data: item,
      position: { x: 0, y: 0 }, // Will be set by dagre
    }));

    // Build edges using refUID
    const edges: Edge[] = data.items
      .filter(
        (item) =>
          item.refUID &&
          item.refUID !==
            "0x0000000000000000000000000000000000000000000000000000000000000000" &&
          attestationMap.has(item.refUID)
      )
      .map((item) => ({
        id: `${item.refUID}-${item.id}`,
        source: item.refUID,
        target: item.id,
        type: ConnectionLineType.SmoothStep,
      }));

    // Apply dagre layout
    return getLayoutedElements(nodes, edges, "TB");
  }, [data]);

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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Attestation Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: "600px" }}>
          <Flow nodes={nodes} edges={edges} />
        </div>
      </CardContent>
    </Card>
  );
}
