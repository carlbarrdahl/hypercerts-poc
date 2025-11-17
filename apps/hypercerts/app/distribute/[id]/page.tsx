import { DistributeFlow } from "@/components/region/distribute-flow";
import { Address } from "viem";

export default async function DistributePage({
  params,
}: {
  params: Promise<{ id: Address }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <DistributeFlow regionVaultId={id} />
    </div>
  );
}
