import { useState } from "react";
import { useSendUserOperation, useSmartAccountClient } from "@account-kit/react";

export function ActAs({
  userAccountAddress,
  orgAccountAddress,
}: {
  userAccountAddress: `0x${string}`;
  orgAccountAddress: `0x${string}`;
}) {
  const [active, setActive] = useState<"user" | "org">("user");
  const { client } = useSmartAccountClient({}); // single client; you choose the sender via the `sender` override
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({ client, waitForTxn: true });

  const sender = active === "user" ? userAccountAddress : orgAccountAddress;

  async function ping(target: `0x${string}`) {
    await sendUserOperation({
      // Many Account-Kit builds let you override sender like this:
      sender,
      uo: { target, data: "0x", value: 0n },
    } as any);
  }

  return (
    <div>
      <div>
        <label><input type="radio" checked={active==="user"} onChange={()=>setActive("user")} /> Act as: User</label>
        <label><input type="radio" checked={active==="org"}  onChange={()=>setActive("org")} /> Act as: Org</label>
      </div>

      <button onClick={() => ping(sender)} disabled={isSendingUserOperation}>
        {isSendingUserOperation ? "Sending..." : `Send from ${active}`}
      </button>
    </div>
  );
}
