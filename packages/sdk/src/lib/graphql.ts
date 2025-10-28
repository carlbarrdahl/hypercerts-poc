import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { Address } from 'viem';

export const INDEXER_URL = 'http://localhost:42069';
export const client = new Client({
	url: 'https://base-sepolia.easscan.org/graphql',
	exchanges: [cacheExchange, fetchExchange],
});

const QUERY = `
query Attestations($where: AttestationWhereInput, $take: Int, $skip: Int, $orderBy: [AttestationOrderByWithRelationInput!]) {

  attestations(where: $where, take: $take, skip: $skip, orderBy: $orderBy) {
    attester
    recipient
	timeCreated
    decodedDataJson
  }
}`;

type Where<T> = { equals?: T; in?: T[] };
export type AttestationQuery = {
	where: {
		attester: Where<Address>;
	};
	take?: number;
	skip?: number;
	orderBy?: {
		timeCreated: 'asc' | 'desc';
	};
};

export type Attestation = {
	attester: Address;
	recipient: Address;
	timeCreated: Date;
	decodedDataJson: Record<string, unknown>;
};

export function queryAttestations({
	where,
	take = 10,
	skip = 0,
	orderBy = { timeCreated: 'desc' },
}: AttestationQuery) {
	return client
		.query(QUERY, { where, take, skip, orderBy })
		.toPromise()
		.then((r) => ({
			...r,
			data: {
				...r.data,
				attestations: r.data.attestations.map((a) => ({
					...a,
					timeCreated: new Date(a.timeCreated * 1000),
					decodedDataJson: parseDecodedMetadata(a.decodedDataJson),
				})),
			},
		}));
}

export function parseDecodedMetadata(json: string): Record<string, unknown> {
	const data = JSON.parse(json) as { name: string; value: { value: string } }[];
	const metadata = data.reduce(
		(acc, x) => ({ ...acc, [x.name]: x.value.value }),
		{},
	);
	return {
		...metadata,
	};
}
