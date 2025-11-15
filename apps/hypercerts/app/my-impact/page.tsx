"use client";

import { useAccount } from "wagmi";
import {
  useListFunders,
  useListContributors,
  useListHypercerts,
  useHypercertsAttestations,
} from "@workspace/sdk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  TrendingUp,
  CheckCircle2,
  Award,
  ShieldCheck,
  DollarSign,
  MapPin,
  ImageIcon,
  Wallet,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function MyImpactPage() {
  const { address, isConnected } = useAccount();

  // Query funders for connected wallet
  const { data: fundersData, isLoading: fundersLoading } = useListFunders(
    {
      where: address ? { address: address.toLowerCase() } : undefined,
    },
    {
      enabled: !!address,
    }
  );

  // Query contributors for connected wallet
  const { data: contributorsData, isLoading: contributorsLoading } =
    useListContributors(
      {
        where: address ? { address: address.toLowerCase() } : undefined,
      },
      {
        enabled: !!address,
      }
    );

  console.log("fundersData", fundersData);
  console.log("contributorsData", contributorsData);

  // Extract unique vault addresses from both funders and contributors
  const vaultAddresses = useMemo(() => {
    const vaults = new Set<string>();

    fundersData?.items?.forEach((f) => {
      if (f.vault) vaults.add(f.vault);
    });

    contributorsData?.items?.forEach((c) => {
      if (c.vault) vaults.add(c.vault);
    });

    return Array.from(vaults);
  }, [fundersData, contributorsData]);

  // Query vaults
  const { data: vaultsData, isLoading: vaultsLoading } = useListHypercerts(
    {
      where: vaultAddresses.length > 0 ? { id_in: vaultAddresses } : undefined,
    },
    {
      enabled: vaultAddresses.length > 0,
    }
  );

  // Query attestations for all vaults
  const { data: attestationsData, isLoading: attestationsLoading } =
    useHypercertsAttestations(
      {
        where:
          vaultAddresses.length > 0
            ? { recipient_in: vaultAddresses }
            : undefined,
      },
      {
        enabled: vaultAddresses.length > 0,
      }
    );

  // Calculate aggregate statistics
  const stats = useMemo(() => {
    if (!attestationsData?.items) {
      return {
        totalProjects: 0,
        totalShares: "0",
        totalAssets: "0",
        totalMilestonesCompleted: 0,
        totalWorkClaims: 0,
        totalVerifications: 0,
        verifiedWorkClaims: 0,
      };
    }

    // Combine shares and assets from both funders and contributors
    let totalShares = 0n;
    let totalAssets = 0n;

    fundersData?.items?.forEach((f) => {
      totalShares += BigInt(f.shares || "0");
      totalAssets += BigInt(f.assets || "0");
    });

    contributorsData?.items?.forEach((c) => {
      totalShares += BigInt(c.shares || "0");
      totalAssets += BigInt(c.assets || "0");
    });

    const milestones = attestationsData.items.filter((a) => {
      const parsed = a.decodedParsed as any;
      return parsed?.type === "milestone";
    });

    const milestonesCompleted = milestones.filter((a) => {
      const parsed = a.decodedParsed as any;
      const metadata =
        typeof parsed.metadata === "string"
          ? JSON.parse(parsed.metadata)
          : parsed.metadata;
      return metadata?.status === "completed";
    }).length;

    const workClaims = attestationsData.items.filter((a) => {
      const parsed = a.decodedParsed as any;
      return parsed?.type === "work-claim";
    });

    const verifications = attestationsData.items.filter((a) => {
      const parsed = a.decodedParsed as any;
      return parsed?.type === "verification";
    });

    const verifiedWorkClaims = new Set(
      verifications
        .filter((v) => {
          const parsed = v.decodedParsed as any;
          const metadata =
            typeof parsed.metadata === "string"
              ? JSON.parse(parsed.metadata)
              : parsed.metadata;
          return metadata?.verified === true;
        })
        .map((v) => v.refUID)
    ).size;

    return {
      totalProjects: vaultAddresses.length,
      totalShares: totalShares.toString(),
      totalAssets: totalAssets.toString(),
      totalMilestonesCompleted: milestonesCompleted,
      totalWorkClaims: workClaims.length,
      totalVerifications: verifications.length,
      verifiedWorkClaims,
    };
  }, [fundersData, contributorsData, attestationsData, vaultAddresses]);

  // Calculate per-project metrics
  const projectsWithMetrics = useMemo(() => {
    if (!vaultsData?.items || !attestationsData?.items) return [];

    return vaultsData.items.map((vault) => {
      // Combine shares and assets from both funders and contributors for this vault
      const funderRecord = fundersData?.items?.find(
        (f) => f.vault === vault.id
      );
      const contributorRecord = contributorsData?.items?.find(
        (c) => c.vault === vault.id
      );

      const totalShares =
        BigInt(funderRecord?.shares || "0") +
        BigInt(contributorRecord?.shares || "0");
      const totalAssets =
        BigInt(funderRecord?.assets || "0") +
        BigInt(contributorRecord?.assets || "0");

      const projectAttestations = attestationsData.items.filter(
        (a) => a.recipient.toLowerCase() === vault.id.toLowerCase()
      );

      const milestones = projectAttestations.filter((a) => {
        const parsed = a.decodedParsed as any;
        return parsed?.type === "milestone";
      });

      const completedMilestones = milestones.filter((a) => {
        const parsed = a.decodedParsed as any;
        const metadata =
          typeof parsed.metadata === "string"
            ? JSON.parse(parsed.metadata)
            : parsed.metadata;
        return metadata?.status === "completed";
      }).length;

      const workClaims = projectAttestations.filter((a) => {
        const parsed = a.decodedParsed as any;
        return parsed?.type === "work-claim";
      });

      const verifications = projectAttestations.filter((a) => {
        const parsed = a.decodedParsed as any;
        return parsed?.type === "verification";
      });

      const verifiedCount = verifications.filter((v) => {
        const parsed = v.decodedParsed as any;
        const metadata =
          typeof parsed.metadata === "string"
            ? JSON.parse(parsed.metadata)
            : parsed.metadata;
        return metadata?.verified === true;
      }).length;

      return {
        vault,
        shares: totalShares.toString(),
        assets: totalAssets.toString(),
        totalMilestones: milestones.length,
        completedMilestones,
        totalWorkClaims: workClaims.length,
        totalVerifications: verifications.length,
        verifiedCount,
      };
    });
  }, [vaultsData, fundersData, contributorsData, attestationsData]);

  const isLoading =
    fundersLoading ||
    contributorsLoading ||
    vaultsLoading ||
    attestationsLoading;

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold">My Impact</h1>
            <p className="text-muted-foreground mt-2">
              Track your contributions and the projects you support
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to see the projects you've funded and the
              impact you're supporting
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && vaultAddresses.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold">My Impact</h1>
            <p className="text-muted-foreground mt-2">
              Track your contributions and the projects you support
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No Projects Funded Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start supporting climate action projects to see your impact here
            </p>
            <Link href="/certs">
              <Button>Browse Projects</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold">My Impact</h1>
          <p className="text-muted-foreground mt-2">
            Track your contributions and the projects you support
          </p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Projects Funded
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalProjects}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Active projects supported
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Shares
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(Number(stats.totalShares) / 1e18).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Impact shares held
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Milestones Completed
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalMilestonesCompleted}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all projects
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Verified Work
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.verifiedWorkClaims}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Work claims verified
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Funded Projects List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-6">Your Funded Projects</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsWithMetrics.map((project) => (
              <ProjectImpactCard key={project.vault.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectImpactCard({ project }: { project: any }) {
  const {
    vault,
    shares,
    assets,
    totalMilestones,
    completedMilestones,
    totalWorkClaims,
    verifiedCount,
  } = project;
  const hasImage = vault.metadata?.image;

  const completionRate =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  return (
    <Link href={`/certs/${vault.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
        <div className="aspect-[16/9] overflow-hidden bg-muted relative">
          {hasImage ? (
            <img
              src={`${vault.metadata.image}?auto=compress%2Cformat&w=600`}
              alt={vault.metadata?.title || "Project"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          {vault.metadata?.pathway && (
            <Badge className="absolute top-3 right-3">
              {vault.metadata.pathway}
            </Badge>
          )}
        </div>

        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {vault.metadata?.title || "Untitled Project"}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {vault.metadata?.description || "No description available"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Funding Info */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Your Shares</div>
              <div className="font-semibold">
                {(Number(shares) / 1e18).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                Assets Deposited
              </div>
              <div className="font-semibold">
                ${(Number(assets) / 1e18).toFixed(0)}
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Award className="w-4 h-4" />
                <span>Milestones</span>
              </div>
              <div className="font-medium">
                {completedMilestones}/{totalMilestones}
                {completionRate > 0 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({completionRate}%)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4" />
                <span>Work Claims</span>
              </div>
              <div className="font-medium">{totalWorkClaims}</div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified</span>
              </div>
              <div className="font-medium text-green-600">{verifiedCount}</div>
            </div>
          </div>

          {/* Progress Bar */}
          {totalMilestones > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )}

          {/* Location */}
          {vault.metadata?.region && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
              <MapPin className="w-3 h-3" />
              {vault.metadata.region}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
