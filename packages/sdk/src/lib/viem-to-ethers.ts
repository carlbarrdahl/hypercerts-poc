import { WalletClient } from 'viem';
import { BrowserProvider } from 'ethers';
import { JsonRpcSigner } from 'ethers';

export function clientToSigner(client: WalletClient) {
	const { account, chain, transport } = client;
	const network = {
		chainId: chain?.id,
		name: chain?.name,
		ensAddress: chain?.contracts?.ensRegistry?.address,
	};
	const provider = new BrowserProvider(transport, network);
	const signer = new JsonRpcSigner(provider, account?.address!);
	return signer;
}
