"use client";

import { useAccount, useWriteContract } from "wagmi";
import { Address, erc20Abi, getAddress, parseUnits } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { useToken } from "@/hooks/use-token";
import { Button } from "@workspace/ui/components/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { useWaitForEvent } from "@/hooks/use-wait-for-event";
import deployments from "@/contracts/deployments.json";

export function MintTokens() {
  const { address } = useAccount();
  const ERC20Mock = deployments[31337].TestToken;
  const waitForEvent = useWaitForEvent(erc20Abi);
  const { writeContractAsync, isPending } = useWriteContract();
  const queryClient = useQueryClient();
  const tokenAddress = ERC20Mock?.address as Address;
  const { data: balance, queryKey } = useToken(tokenAddress, address);
  return (
    <Alert className="">
      <AlertTitle>Mint test tokens</AlertTitle>
      <AlertDescription>
        You can mint test tokens to use for joining and funding commits.
      </AlertDescription>
      <div className="flex items-center justify-between">
        <div className="text-xs min-w-24">
          Balance:{" "}
          <div className="font-semibold">
            {balance?.formatted} {balance?.symbol}
          </div>
        </div>
        <Button
          isLoading={isPending}
          variant="outline"
          size="sm"
          onClick={async () => {
            await writeContractAsync({
              address: tokenAddress,
              abi: [
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "to",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                  ],
                  name: "mint",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ],
              functionName: "mint",
              args: [
                getAddress(address!),
                parseUnits("1000", balance?.decimals ?? 18),
              ],
            })
              .then((hash) => waitForEvent(hash, "Transfer"))
              .then((logs) => queryClient.invalidateQueries({ queryKey }));
          }}
        >
          Mint Tokens
        </Button>
      </div>
    </Alert>
  );
}
