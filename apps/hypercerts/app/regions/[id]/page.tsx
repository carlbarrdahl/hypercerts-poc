import { RegionDetails } from "@/components/region/details";
import { ContributorsList } from "@/components/vault/contributors";
import { Address } from "viem";
import { FundersList } from "@/components/vault/funders";

export default async function CertPage({
  params,
}: {
  params: { id: Promise<Address> };
}) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <RegionDetails id={id} />
    </div>
  );
}
