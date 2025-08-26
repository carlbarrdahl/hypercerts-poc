import { Address } from "viem";
import { useWallets } from "@privy-io/react-auth";

export function useAddress() {
    const { wallets, ready } = useWallets();
    const wallet = wallets?.find((w) => w.walletClientType === "privy");
	const address = wallet?.address as Address;
	return { address, isPending: !ready };
}