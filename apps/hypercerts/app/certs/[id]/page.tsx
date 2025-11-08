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
    <div className="min-h-screen bg-background">
      <VaultDetails id={id} />

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ContributorsList id={id} />
          <FundersList id={id} />
        </div>

        <Attestations id={id} />
      </div>
    </div>
  );
}
