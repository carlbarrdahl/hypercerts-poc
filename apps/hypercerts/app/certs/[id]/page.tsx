import { VaultDetails } from "@/components/vault/details";
import { ContributorsList } from "@/components/vault/contributors";
import { Address } from "viem";
import { FundersList } from "@/components/vault/funders";
import { Attestations } from "@/components/vault/attestations";

export default async function CertPage({
  params,
}: {
  params: { id: Address };
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <VaultDetails id={id} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContributorsList id={id} />
        <FundersList id={id} />
      </div>

      <Attestations id={id} />
    </div>
  );
}
