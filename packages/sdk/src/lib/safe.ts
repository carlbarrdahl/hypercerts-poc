import Safe, { Eip1193Provider } from '@safe-global/protocol-kit';

import { Address } from 'viem';

export async function initSafe(data: {
	provider: string;
	owners?: Address[];

	safeAddress?: Address;
}): Promise<Safe> {
	const { provider, owners, safeAddress } = data;

	if (safeAddress) {
		return await Safe.init({ provider, safeAddress });
	}
	if (!owners?.length) {
		throw new Error('No owners provided');
	}

	return await Safe.init({
		provider,
		signer: owners[0],
		predictedSafe: {
			safeAccountConfig: {
				owners,
				threshold: 1,
			},
			safeDeploymentConfig: {
				saltNonce: '3',
				safeVersion: '1.4.1',
				deploymentType: 'canonical',
			},
		},
	});
}
