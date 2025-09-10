import { Address, erc20Abi, formatUnits, zeroAddress } from "viem";
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { useWaitForEvent } from "./use-wait-for-event";
import { useQueryClient } from "@tanstack/react-query";

type TokenData = {
  address?: Address;
  balance?: bigint;
  formatted: string | null;
  symbol?: string;
  decimals: number;
};

type UseTokenResult = Omit<ReturnType<typeof useReadContracts>, "data"> & {
  data: TokenData | null;
  query: { enabled: boolean };
};

type UseApproveResult = Omit<
  ReturnType<typeof useWriteContract>,
  "writeContractAsync"
> & {
  writeContractAsync: (amount?: bigint) => Promise<unknown>;
};

// Get token decimals, symbol, and account balance
export function useToken(address?: Address, account?: Address): UseTokenResult {
  const contract = { address, abi: erc20Abi } as const;

  const { data, ...query } = useReadContracts({
    contracts: [
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "decimals" },
      ...(account
        ? [{ ...contract, functionName: "balanceOf", args: [account] }]
        : []),
    ],
  });

  const [symbol, decimals = 18, balance] = data?.map((d) => d.result) ?? [];

  return {
    ...query,
    data: query.isPending
      ? null
      : {
          address,
          balance: balance as bigint | undefined,
          formatted:
            typeof balance !== "undefined"
              ? formatUnits(balance as bigint, Number(decimals))
              : null,
          symbol: symbol as string,
          decimals: Number(decimals),
        },
    query: { enabled: Boolean(address && address !== zeroAddress) },
  };
}

// Check token allowance for owner and spender
export function useAllowance(
  token: Address,
  owner: Address | undefined,
  spender: Address
) {
  return useReadContract({
    abi: erc20Abi,
    address: token,
    args: [owner!, spender],
    functionName: "allowance",
    query: { enabled: Boolean(owner && spender && token !== zeroAddress) },
  });
}

// Approve token transfers for spender
export function useApprove(token: Address, spender: Address): UseApproveResult {
  const queryClient = useQueryClient();
  const approve = useWriteContract();
  const { address } = useAccount();
  const { queryKey: balanceQueryKey } = useToken(token, address);
  const { queryKey: allowanceQueryKey } = useAllowance(token, address, spender);
  const waitForEvent = useWaitForEvent(erc20Abi);

  return {
    ...approve,
    writeContractAsync: (amount = 0n) => {
      console.log("approving", { spender, amount, token });
      return approve
        .writeContractAsync({
          address: token,
          abi: erc20Abi,
          functionName: "approve",
          args: [spender, amount],
        })
        .then(async (hash) => {
          const logs = await waitForEvent(hash, "Approval");
          await queryClient.invalidateQueries({ queryKey: allowanceQueryKey });
          await queryClient.invalidateQueries({ queryKey: balanceQueryKey });
          return logs;
        });
    },
  };
}
