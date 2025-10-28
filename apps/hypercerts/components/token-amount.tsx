import { Address, formatUnits, zeroAddress } from "viem";
import { useToken } from "@/hooks/use-token";
import { formatNumber } from "@/lib/format";
import { cn } from "@workspace/ui/lib/utils";

export function TokenAmount({
  amount,
  token,
  hideSymbol = false,
}: {
  amount?: number | bigint | string;
  token: Address;
  hideSymbol?: boolean;
}) {
  const { data } = useToken(token);
  if (!data || amount === undefined) return null;
  const formattedAmount = formatNumber(
    +Number(formatUnits(BigInt(amount), data?.decimals ?? 18)).toFixed(2)
  );

  const symbol = token === zeroAddress ? "ETH" : data?.symbol;
  return <>{`${formattedAmount} ${hideSymbol ? "" : symbol}`}</>;
}

export const Amount = ({
  amount,
  decimals = 18,
  symbol,
  className,
  hideSymbol = false,
}: {
  amount?: bigint | string;
  decimals?: number;
  symbol?: string;
  className?: string;
  hideSymbol?: boolean;
}) => {
  if (!amount) return "--";
  const formattedAmount = formatNumber(
    parseFloat(formatUnits(BigInt(amount), decimals))
  );
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span className="">{formattedAmount}</span>
      {!hideSymbol && <span className="text-[10px]">{symbol}</span>}
    </span>
  );
};
