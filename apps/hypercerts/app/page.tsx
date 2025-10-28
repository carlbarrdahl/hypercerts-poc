"use client";

import { CreateVault } from "@/components/vault/create";
import { MintTokens } from "@/components/dev/mint-tokens";
import { VaultsList } from "@/components/vault/list";

export default function Page() {
  return (
    <div>
      {/* <CreateVault /> */}
      <VaultsList />
      {/* <Organisation /> */}
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
