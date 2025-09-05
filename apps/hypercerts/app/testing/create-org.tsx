// components/InitOrgModular.tsx
import { useSmartAccountClient, useSendUserOperation } from "@account-kit/react";
import { encodeFunctionData } from "viem";
import { MULTI_OWNER_MODULE_ABI } from "../contracts/abis"; // installModule(), setOwnersAndThreshold(address[],uint256)

export function CreateOrganisation({
  orgAddress,
  owners,
  threshold,
  moduleAddress,
}: {
  orgAddress: `0x${string}`;
  owners: `0x${string}`[];
  threshold: bigint;
  moduleAddress: `0x${string}`;
}) {
  const { client } = useSmartAccountClient({});
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({ client, waitForTxn: true });

  async function init() {
    const enableData = encodeFunctionData({
      abi: MULTI_OWNER_MODULE_ABI,
      functionName: "enableModule",
      args: [moduleAddress],
    });

    const configData = encodeFunctionData({
      abi: MULTI_OWNER_MODULE_ABI,
      functionName: "setOwnersAndThreshold",
      args: [owners, threshold],
    });

    // If your Account Kit exposes batching, pass an array of calls.
    await sendUserOperation({
      uo: [
        { target: orgAddress, data: enableData, value: 0n },
        { target: orgAddress, data: configData, value: 0n },
      ],
    } as any);
  }

  return (
    <button onClick={init} disabled={isSendingUserOperation}>
      {isSendingUserOperation ? "Initializing..." : "Initialize Org Multisig"}
    </button>
  );
}
