// components/AddOwnerLight.tsx
import { useSmartAccountClient, useSendUserOperation } from "@account-kit/react";
import { encodeFunctionData } from "viem";
import { MULTI_OWNER_LIGHT_ABI } from "../contracts/abis"; // addOwner(address)

export  function AddOwner({ accountAddress }: { accountAddress: `0x${string}` }) {
  const { client } = useSmartAccountClient({});
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({ client, waitForTxn: true });

  async function addOwner(newOwner: `0x${string}`) {
    const data = encodeFunctionData({
      abi: MULTI_OWNER_LIGHT_ABI,
      functionName: "addOwner",
      args: [newOwner],
    });

    await sendUserOperation({
      uo: {
        target: accountAddress, // call the LightAccount itself
        data,
        value: 0n,
      },
    });
  }

  return (
    <form
      onSubmit={(e: any) => {
        e.preventDefault();
        addOwner(e.target.elements.owner.value);
      }}
    >
      <input name="owner" placeholder="0xNewOwner" />
      <button disabled={isSendingUserOperation}>
        {isSendingUserOperation ? "Adding..." : "Add owner"}
      </button>
    </form>
  );
}
