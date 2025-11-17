import { Address } from "viem";
import { PathwayDetails } from "@/components/pathway/details";

export default async function PathwayPage({
  params,
}: {
  params: Promise<{ id: Address }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <PathwayDetails id={id} />
    </div>
  );
}
