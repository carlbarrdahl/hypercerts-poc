import { PropsWithChildren } from "react";
import { Address, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { useAllowance, useApprove, useToken } from "@/hooks/use-token";
import { Button } from "@workspace/ui/components/button";
import { TokenAmount } from "./token-amount";
import { BalanceCheck } from "./balance-check";

export function AllowanceCheck({
  children,
  amount = BigInt(0),
  tokenAddress,
  spender,
}: PropsWithChildren<{
  amount?: bigint;
  tokenAddress: Address;
  spender: Address;
}>) {
  const { address, isConnected } = useAccount();

  const allowance = useAllowance(tokenAddress, address, spender);
  const approve = useApprove(tokenAddress, spender);
  const token = useToken(tokenAddress, address);

  // console.log(allowance.data, spender, tokenAddress);
  if (tokenAddress === zeroAddress) {
    return <BalanceCheck amount={amount}>{children}</BalanceCheck>;
  }
  if (!isConnected) return null;
  if (token.isPending || allowance.isPending) return <Button isLoading />;
  if (amount > (allowance.data ?? BigInt(0))) {
    return (
      <Button
        variant="outline"
        type="button"
        isLoading={approve.isPending}
        onClick={() => approve.writeContractAsync(amount)}
      >
        Approve <TokenAmount amount={amount} token={tokenAddress} />
      </Button>
    );
  }

  if ((token.data?.balance ?? BigInt(0)) <= amount) {
    return (
      <Button disabled variant="ghost">
        Insufficient balance
      </Button>
    );
  }

  return <>{children}</>;
}
