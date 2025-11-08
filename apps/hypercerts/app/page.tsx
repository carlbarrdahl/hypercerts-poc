"use client";

import { CreateVault } from "@/components/vault/create";
import { MintTokens } from "@/components/dev/mint-tokens";
import { VaultsList } from "@/components/vault/list";
import { Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="max-w-6xl mx-auto px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Hypercerts Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                Impact Vaults
                <br />
                <span className="text-muted-foreground">
                  for Regenerative Action
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create and manage hypercerts that represent verified impact
                contributions to climate and nature solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vaults List */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <VaultsList />
        </div>
      </section>
    </div>
  );
}

// function Organisation() {
//   const { address } = useAddress();
//   const { sdk } = useHypercerts();
//   // const { data } = useHypercertsOrganization(address!);
//   const { data } = useHypercertsPrepareOrganization(address!);
//   if (!data) return <div>Loading...</div>;

//   // return <Button onClick={async () => {
//   //   const tx = await sdk?.organization.create(address!);

//   //   console.log(tx);
//   //   sendTransaction(tx!);
//   // }}>Create Organization</Button>
//   return (
//     <div>
//       <Link href={`/org/${data.address}`}>
//         <pre className="border rounded p-2 hover:bg-muted">
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       </Link>
//     </div>
//   );
// }
