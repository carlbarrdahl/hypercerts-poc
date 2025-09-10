import { PropsWithChildren } from "react";
import { useAccount, useBalance } from "wagmi";
import { Button } from "@workspace/ui/components/button";

export function BalanceCheck({
  amount = 0n,
  children,
}: PropsWithChildren<{ amount?: number | bigint }>) {
  const { address, isConnected } = useAccount();
  const { data: { value = 0n } = {}, isPending } = useBalance({
    address,
    query: { enabled: isConnected },
  });
  if (!isConnected) return children;
  if (isPending) return <Button variant={"outline"} isLoading />;

  if (value > amount) return <>{children}</>;

  return (
    <Button disabled variant="ghost">
      Insufficient balance
    </Button>
  );
}
