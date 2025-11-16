"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useHypercerts, useListHypercerts } from "@workspace/sdk";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Address, parseUnits, formatUnits } from "viem";
import { TokenAmount } from "../token-amount";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { Page } from "@/components/page";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  Panel,
  Position,
  Handle,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";
import { Loader2, Plus, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { BannerImage } from "../banner-image";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 350;
const nodeHeight = 200;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "LR"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: 150,
    nodesep: 100,
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

type ProjectDistribution = {
  vaultId: Address;
  amount: string;
};

type RegionNodeData = {
  id: Address;
  name: string;
  balance: bigint;
  tokenSymbol: string;
  tokenDecimals: number;
  image?: string;
};

type ProjectNodeData = {
  id: Address;
  name: string;
  amount: string;
  balance: bigint;
  tokenSymbol: string;
  tokenDecimals: number;
  image?: string;
  onAmountChange: (amount: string) => void;
  onRemove: () => void;
};

function RegionNode({ data }: { data: RegionNodeData }) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="px-4 py-3 rounded-lg border-2 bg-purple-50 border-purple-300 shadow-md w-[350px] cursor-pointer hover:shadow-lg transition-all">
        <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-2">
          Region Vault
        </div>
        <div className="flex items-center gap-3 mb-3">
          {data.image && (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <BannerImage src={data.image} alt={data.name} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div
              className="text-base font-semibold text-gray-900 mb-1 truncate"
              title={data.name}
            >
              {data.name}
            </div>
            <div className="text-xs text-gray-500">
              {formatUnits(data.balance, data.tokenDecimals)} {data.tokenSymbol}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-400">Available to distribute</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function ProjectNode({ data }: { data: ProjectNodeData }) {
  const hasAmount = data.amount && parseFloat(data.amount) > 0;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} />
      <div className="px-4 py-3 rounded-lg border-2 bg-blue-50 border-blue-300 shadow-sm w-[350px] hover:shadow-md transition-all">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-2">
          Project Vault
        </div>
        <div className="flex items-center gap-3 mb-3">
          {data.image && (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <BannerImage src={data.image} alt={data.name} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-semibold text-gray-900 mb-1 truncate"
              title={data.name}
            >
              {data.name}
            </div>
            <div className="text-xs text-gray-500">
              Balance: {formatUnits(data.balance, data.tokenDecimals)}{" "}
              {data.tokenSymbol}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-600 mb-1 block font-medium">
              Amount to distribute
            </label>
            <Input
              type="number"
              autoFocus
              value={data.amount}
              placeholder={`0.0 ${data.tokenSymbol}`}
              onChange={(e) => data.onAmountChange(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          {hasAmount && (
            <div className="text-xs text-green-600 font-medium">
              → {data.amount} {data.tokenSymbol}
            </div>
          )}
          <button
            onClick={data.onRemove}
            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

const nodeTypes = {
  regionNode: RegionNode,
  projectNode: ProjectNode,
};

export function DistributeFlow({ regionVaultId }: { regionVaultId: Address }) {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { sdk } = useHypercerts();
  const [distributions, setDistributions] = useState<ProjectDistribution[]>([]);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  // Fetch region vault
  const {
    data: vault,
    error: vaultError,
    isLoading: isLoadingVault,
  } = useQuery({
    queryKey: ["region", regionVaultId],
    queryFn: () =>
      sdk?.vault.query({ where: { id: regionVaultId }, limit: 1 }) ?? null,
    select: (data) => data?.items[0],
  });

  // Fetch balance
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["region", regionVaultId, "balance"],
    queryFn: () => sdk?.vault.balance(regionVaultId) ?? null,
    enabled: Boolean(regionVaultId),
  });

  // Fetch all vaults for projects list
  const { data: allVaults } = useListHypercerts({});

  // Filter for project vaults only
  const projectVaults = useMemo(() => {
    if (!allVaults?.items) return [];
    return allVaults.items;
    return allVaults.items.filter(
      (v) =>
        v.metadata?.type === "project" &&
        v.id.toLowerCase() !== regionVaultId.toLowerCase()
    );
  }, [allVaults, regionVaultId]);

  // Get balances for selected projects
  const selectedProjectIds = distributions.map((d) => d.vaultId);
  const { data: projectBalances } = useQuery({
    queryKey: ["projectBalances", selectedProjectIds],
    queryFn: async () => {
      if (!sdk || selectedProjectIds.length === 0) return {};
      const balances: Record<string, bigint> = {};
      await Promise.all(
        selectedProjectIds.map(async (id) => {
          const bal = await sdk.vault.balance(id);
          balances[id.toLowerCase()] = bal?.assets ?? 0n;
        })
      );
      return balances;
    },
    enabled: Boolean(sdk && selectedProjectIds.length > 0),
  });

  const metadata = vault?.metadata as Record<string, any> | undefined;
  const regionName = metadata?.title || "Region";
  const image = metadata?.image;
  const tokenSymbol = vault?.token?.symbol || "tokens";
  const tokenDecimals = vault?.token?.decimals || 18;

  // Calculate total distribution amount
  const totalDistribution = useMemo(() => {
    return distributions.reduce((sum, dist) => {
      const amount = parseFloat(dist.amount || "0");
      return sum + amount;
    }, 0);
  }, [distributions]);

  const totalDistributionWei = parseUnits(
    String(totalDistribution),
    tokenDecimals
  );

  // Check if user is owner
  const isOwner = address && vault?.owner === address.toLowerCase();

  // Add a project to distribution
  const addProject = useCallback(
    (vaultId: Address) => {
      if (distributions.some((d) => d.vaultId === vaultId)) {
        toast.error("Project already added");
        return;
      }
      setDistributions([...distributions, { vaultId, amount: "" }]);
      setIsAddProjectOpen(false);
    },
    [distributions]
  );

  // Update amount for a project
  const updateAmount = useCallback(
    (vaultId: Address, amount: string) => {
      setDistributions(
        distributions.map((d) => (d.vaultId === vaultId ? { ...d, amount } : d))
      );
    },
    [distributions]
  );

  // Remove project from distribution
  const removeProject = useCallback(
    (vaultId: Address) => {
      setDistributions(distributions.filter((d) => d.vaultId !== vaultId));
    },
    [distributions]
  );

  // Execute distribution
  const distribute = useMutation({
    mutationFn: async () => {
      if (!sdk) throw new Error("SDK not initialized");

      // Validate amounts
      if (totalDistributionWei > (balance?.assets ?? 0n)) {
        throw new Error("Total distribution exceeds available balance");
      }

      const validDistributions = distributions.filter(
        (d) => d.amount && parseFloat(d.amount) > 0
      );

      if (validDistributions.length === 0) {
        throw new Error("No valid distributions to execute");
      }

      // Execute all distributions
      const results = await Promise.all(
        validDistributions.map((dist) =>
          sdk.vault.depositToVault(
            regionVaultId,
            dist.vaultId,
            parseUnits(dist.amount, tokenDecimals)
          )
        )
      );

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [] });
      toast.success("Funds distributed successfully!");
      setDistributions([]);
    },
    onError: (error) => {
      toast.error("Distribution failed", {
        description: error.message,
      });
    },
  });

  // Track node structure (IDs only) to detect when layout needs recalculation
  const nodeStructure = useMemo(
    () => ["region", ...distributions.map((d) => d.vaultId)].join(","),
    [distributions]
  );

  // Setup ReactFlow nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Only recalculate layout when node structure changes (add/remove), not when data changes
  useEffect(() => {
    if (!vault || !balance) return;

    const newNodes: Node[] = [
      {
        id: "region",
        type: "regionNode",
        position: { x: 0, y: 0 },
        data: {
          id: regionVaultId,
          name: regionName,
          balance: balance.assets,
          tokenSymbol,
          tokenDecimals,
          image,
        },
      },
    ];

    const newEdges: Edge[] = [];

    distributions.forEach((dist) => {
      const project = projectVaults.find(
        (p) => p.id.toLowerCase() === dist.vaultId.toLowerCase()
      );
      if (!project) return;

      const projectMeta = project.metadata as Record<string, any> | undefined;
      const projectBalance =
        projectBalances?.[dist.vaultId.toLowerCase()] ?? 0n;

      newNodes.push({
        id: dist.vaultId,
        type: "projectNode",
        position: { x: 0, y: 0 },
        data: {
          id: dist.vaultId,
          name: projectMeta?.title || "Project",
          amount: dist.amount,
          balance: projectBalance,
          tokenSymbol,
          tokenDecimals,
          image: projectMeta?.image,
          onAmountChange: (amount: string) =>
            updateAmount(dist.vaultId, amount),
          onRemove: () => removeProject(dist.vaultId),
        },
      });

      newEdges.push({
        id: `region-${dist.vaultId}`,
        source: "region",
        target: dist.vaultId,
        type: ConnectionLineType.SmoothStep,
        animated: true,
        label: dist.amount ? `${dist.amount} ${tokenSymbol}` : "Set amount",
      });
    });

    // Apply dagre layout and update state
    const layouted = getLayoutedElements(newNodes, newEdges, "LR");
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [
    nodeStructure, // Only recalculate when structure changes
    vault,
    balance,
    projectVaults,
    projectBalances,
    regionVaultId,
    regionName,
    tokenSymbol,
    tokenDecimals,
    image,
    setNodes,
    setEdges,
  ]);

  // Update node data (amounts, labels) without recalculating layout
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        // Update region node data
        if (node.id === "region") {
          return {
            ...node,
            data: {
              ...node.data,
              balance: balance?.assets,
            },
          };
        }

        // Update project node data
        const dist = distributions.find((d) => d.vaultId === node.id);
        if (dist) {
          const projectBalance =
            projectBalances?.[dist.vaultId.toLowerCase()] ?? 0n;
          return {
            ...node,
            data: {
              ...node.data,
              amount: dist.amount,
              balance: projectBalance,
              onAmountChange: (amount: string) =>
                updateAmount(dist.vaultId, amount),
              onRemove: () => removeProject(dist.vaultId),
            },
          };
        }

        return node;
      })
    );

    // Update edge labels
    setEdges((eds) =>
      eds.map((edge) => {
        const dist = distributions.find(
          (d) => edge.id === `region-${d.vaultId}`
        );
        if (dist) {
          return {
            ...edge,
            label: dist.amount ? `${dist.amount} ${tokenSymbol}` : "Set amount",
          };
        }
        return edge;
      })
    );
  }, [
    distributions,
    balance,
    projectBalances,
    tokenSymbol,
    updateAmount,
    removeProject,
    setNodes,
    setEdges,
  ]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep }, eds)
      ),
    [setEdges]
  );

  const isLoading = isLoadingVault || isLoadingBalance;

  if (vaultError) {
    return (
      <Page title="Back to region" backLink={`/regions/${regionVaultId}`}>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Region
            </CardTitle>
            <CardDescription>
              Unable to load region details. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </Page>
    );
  }

  if (isLoading) {
    return (
      <Page title="Back to region" backLink={`/regions/${regionVaultId}`}>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading distribution interface...</span>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Back to region" backLink={`/regions/${regionVaultId}`}>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Distribute Funds
          </h1>
          <p className="text-muted-foreground mt-2">
            Distribute funds from {regionName} to project vaults
          </p>
        </div>

        {!isOwner && (
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardHeader>
              <CardTitle className="text-yellow-600 dark:text-yellow-500">
                View Only
              </CardTitle>
              <CardDescription>
                You are not the owner of this vault. You can view the
                distribution interface but cannot execute distributions.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="h-[600px] border rounded-lg bg-muted/30">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionLineType={ConnectionLineType.SmoothStep}
            nodeTypes={nodeTypes}
            // fitView
            minZoom={0.1}
            maxZoom={2}
          >
            <Background variant={BackgroundVariant.Dots} />
            <Controls />
            <Panel position="top-right" className="space-y-2">
              <Dialog
                open={isAddProjectOpen}
                onOpenChange={setIsAddProjectOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Project Vault</DialogTitle>
                    <DialogDescription>
                      Choose a project vault to distribute funds to
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 mt-4">
                    {projectVaults.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No project vaults available
                      </p>
                    ) : (
                      projectVaults.map((project) => {
                        const projectMeta = project.metadata as
                          | Record<string, any>
                          | undefined;
                        const isAdded = distributions.some(
                          (d) =>
                            d.vaultId.toLowerCase() === project.id.toLowerCase()
                        );
                        return (
                          <Card
                            key={project.id}
                            className={`cursor-pointer transition-colors hover:border-primary ${
                              isAdded ? "opacity-50" : ""
                            }`}
                            onClick={() =>
                              !isAdded && addProject(project.id as Address)
                            }
                          >
                            <CardHeader className="p-4">
                              <div className="flex items-center gap-3">
                                {projectMeta?.image && (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <BannerImage
                                      src={projectMeta.image}
                                      alt={projectMeta?.title || "Project"}
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <CardTitle
                                    className="text-base truncate"
                                    title={
                                      projectMeta?.title || "Untitled Project"
                                    }
                                  >
                                    {projectMeta?.title || "Untitled Project"}
                                  </CardTitle>
                                  <p
                                    className="text-xs text-muted-foreground line-clamp-2"
                                    title={
                                      projectMeta?.description ||
                                      "No description"
                                    }
                                  >
                                    {projectMeta?.description ||
                                      "No description"}
                                  </p>
                                </div>
                                {isAdded && (
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    Added
                                  </span>
                                )}
                              </div>
                            </CardHeader>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </Panel>
            <Panel position="bottom-right">
              <Card className="min-w-[400px]">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Distribution
                      </span>
                      <span className="font-semibold text-lg">
                        {totalDistribution.toFixed(2)} {tokenSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Available Balance
                      </span>
                      <span>
                        {formatUnits(balance?.assets ?? 0n, tokenDecimals)}{" "}
                        {tokenSymbol}
                      </span>
                    </div>
                    {totalDistributionWei > (balance?.assets ?? 0n) && (
                      <p className="text-xs text-destructive">
                        Total distribution exceeds available balance
                      </p>
                    )}
                    <Button
                      onClick={() => distribute.mutate()}
                      loadingText="Distributing..."
                      isLoading={distribute.isPending}
                      iconRight={ArrowRight}
                      disabled={
                        !isOwner ||
                        distributions.length === 0 ||
                        totalDistribution === 0 ||
                        totalDistributionWei > (balance?.assets ?? 0n) ||
                        distribute.isPending
                      }
                      className="w-full"
                    >
                      Distribute Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </Page>
  );
}
