import { Address } from 'viem';
import {
	EAS,
	SchemaEncoder,
	NO_EXPIRATION,
	TransactionSigner,
} from '@ethereum-attestation-service/eas-sdk';

const schemaUID =
	'0x7876d5406011830fa45bdfb6c7751d94a3c1477538f6a98f2668c2ab2bf898cd';

export type AttestationInput = {
	recipient: Address;
	data: any;
};

export async function createAttestation(
	{ recipient, data }: AttestationInput,
	signer: TransactionSigner,
): Promise<string> {
	const EASContractAddress = '0x4200000000000000000000000000000000000021';
	const eas = new EAS(EASContractAddress);

	eas.connect(signer);

	const schemaEncoder = new SchemaEncoder('string description');
	const encodedData = schemaEncoder.encodeData([
		{
			name: 'description',
			value: data,
			type: 'string',
		},
	]);
	return eas
		.attest({
			schema: schemaUID,
			data: {
				recipient,
				expirationTime: NO_EXPIRATION,
				data: encodedData,
			},
		})
		.then((tx) => tx.wait());
}
