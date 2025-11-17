"use client";

import {
  useListHypercerts,
  useHypercerts,
  useListFunders,
  useListFunding,
  Funding,
} from "@workspace/sdk";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item";
import { Address, formatUnits } from "viem";
import { TokenAmount } from "../token-amount";
import { useMemo } from "react";

function ProjectItem({ assets, vault }: { assets: string; vault?: Address }) {
  const { data: vaultData } = useListHypercerts(
    {
      where: { id_in: [vault] },
    },
    { enabled: Boolean(vault) }
  );

  const project = vaultData?.items?.[0];

  console.log("vaultData", project, vault);
  const truncatedDescription = project?.metadata?.description
    ? project.metadata.description.length > 80
      ? `${project.metadata.description.substring(0, 80)}...`
      : project.metadata.description
    : "No description available";

  return (
    <Item variant="muted" asChild role="listitem">
      <Link href={`/projects/${project?.id}`}>
        <ItemMedia variant="image">
          <Image
            src={
              project?.metadata?.image ||
              `https://avatar.vercel.sh/${project?.id}`
            }
            alt={project?.metadata?.title || "Project"}
            width={48}
            height={48}
            className="object-cover rounded"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">
            {project?.metadata?.title || "Untitled Project"}
          </ItemTitle>
          <ItemDescription className="line-clamp-1">
            {truncatedDescription}
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-right">
          <ItemTitle className="text-sm">
            <TokenAmount amount={assets} token={project?.token?.address} />
          </ItemTitle>
        </ItemContent>
      </Link>
    </Item>
  );
}

export function FundedProjectsList({ id }: { id: Address }) {
  // First, get all funders for this vault
  const { data, error } = useListFunding(
    {
      where: { sender: id },
    },
    {
      refetchInterval: 1000,
    }
  );

  const projectsById = useMemo(() => {
    return (
      data?.items.reduce(
        (acc, funding) => {
          return {
            ...acc,
            [funding.vault]:
              (acc[funding.vault] ?? 0n) + BigInt(funding.assets),
          };
        },
        {} as Record<Address, bigint>
      ) ??
      {} ??
      {}
    );
  }, [data]);
  console.log("funders", projectsById, error);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Funded Projects
        </CardTitle>
        <CardDescription>
          Projects receiving funding from this vault
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-1">
          {Object.entries(projectsById).map(([vault, assets]) => (
            <ProjectItem key={vault} vault={vault} assets={assets} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
