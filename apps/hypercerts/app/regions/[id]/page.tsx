import { VaultDetails } from "@/components/vault/details";
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
      <VaultDetails id={id} />
      <ContributorsList id={id} />
      <FundersList id={id} />
    </div>
  );
}
