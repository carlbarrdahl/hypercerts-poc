import {
	Account,
	Transport,
	Chain,
	Address,
	Client,
	WalletClient,
	parseEventLogs,
	Hex,
	zeroAddress,
	keccak256,
	encodeAbiParameters,
	encodePacked,
	zeroHash,
} from 'viem';
import {
	EAS,
	SchemaEncoder,
	NO_EXPIRATION,
	TransactionSigner,
	SchemaRegistry,
} from '@ethereum-attestation-service/eas-sdk';
import { JsonRpcSigner } from 'ethers';
import deployments from '../deployments.json';
import { clientToSigner } from './viem-to-ethers';
import { baseSepolia, hardhat } from 'viem/chains';
import { z } from 'zod';
import { Logger } from './logger';
import { waitForTransactionReceipt } from 'viem/actions';
import { INDEXER_URL } from './graphql';
import ky from 'ky';
// const schemaUID =
// 	'0x7876d5406011830fa45bdfb6c7751d94a3c1477538f6a98f2668c2ab2bf898cd';

export const AttestationInputSchema = z.object({
	recipient: z.string(),
	data: z.object({
		type: z.string(),
		metadata: z.object({
			title: z.string(),
			description: z.string().optional(),
			image: z.string().optional(),
			geoJSON: z
				.object({
					type: z.string(),
					coordinates: z.array(z.array(z.array(z.number()))),
				})
				.optional(),
		}),
	}),
	/*
	Private: Visible only to attestation creator and explicitly authorized parties
	Organizational: Visible within specific organizations
	Public Draft: Visible to community for review and comment before publication
	Published: Permanently published to EAS with full transparency
	*/
	visibility: z.enum(['private', 'organization', 'draft', 'published']),
});

export type AttestationInput = z.infer<typeof AttestationInputSchema>;

export const config = {
	eas: {
		[hardhat.id]: deployments['31337'].EAS.address,
		[baseSepolia.id]: '0x4200000000000000000000000000000000000021',
	},
	registry: {
		[hardhat.id]: deployments['31337'].SchemaRegistry.address,
		[baseSepolia.id]: '0x4200000000000000000000000000000000000020',
	},
};
export async function createAttestation(
	input: AttestationInput,
	client: WalletClient,
): Promise<string> {
	try {
		console.log('attesting', input);
		const metadata = AttestationInputSchema.parse(input);

		const { visibility } = input;
		const signer = clientToSigner(client);
		const EASContractAddress =
			config.eas[client.chain?.id as keyof typeof config.eas];
		if (!EASContractAddress)
			throw new Error(
				'EAS contract address not found for network: ' + client.chain?.id,
			);
		const eas = new EAS(EASContractAddress);
		eas.connect(signer);

		const isOnchain = visibility === 'published';
		const schema = 'string type, string metadata, string visibility';
		const schemaEncoder = new SchemaEncoder(schema);
		const metadataURI = JSON.stringify(input.data.metadata);
		const data = schemaEncoder.encodeData([
			{ name: 'type', value: input.data.type, type: 'string' },
			{ name: 'metadata', value: metadataURI, type: 'string' },
			{ name: 'visibility', value: input.visibility, type: 'string' },
		]);

		const { recipient } = input;

		const defaultAttestation = {
			recipient,
			expirationTime: NO_EXPIRATION,
			revocable: true,
			data,
		};
		if (isOnchain) {
			console.info('creating onchain attestation');

			const schemaUID = await registerSchema(schema, signer);
			console.log('attest to schemaUID', schemaUID);

			return eas
				.attest({
					schema: schemaUID,
					data: defaultAttestation,
				})
				.then((tx) => tx.wait());
		} else {
			throw new Error('Offchain attestations are not implemented yet');
			/*
	
	- private attestations
		- save metadata to PG
		- save attestation to PG
		- publish attestations
		- save metadata to IPFS
		- create onchain attestation
		
		*/
			console.info('creating offchain attestation');
			const offchain = await eas.getOffchain();

			// TODO: Parse input.metadata

			const offchainAttestation = await offchain.signOffchainAttestation(
				{
					...defaultAttestation,
					time: BigInt(Math.floor(Date.now() / 1000)), // Unix timestamp of current time
					schema: schemaUID,
					refUID:
						'0x0000000000000000000000000000000000000000000000000000000000000000',
					data,
				},
				signer,
			);

			console.log('offchainAttestation', offchainAttestation);

			// Get attester address from client
			const attester = client.account?.address;
			if (!attester) {
				throw new Error('No account address found');
			}

			const response = await ky
				.post(`${INDEXER_URL}/attestation`, {
					json: {
						attestation: {
							uid: offchainAttestation.uid,
							attester,
							...offchainAttestation.message,
							time: offchainAttestation.message.time.toString(),
							expirationTime:
								offchainAttestation.message.expirationTime.toString(),
						},
						decodedDataJson: JSON.stringify({
							type: input.data.type,
							metadataURI,
							visibility: input.visibility,
						}),
					},
				})
				.json<{ success: boolean; uid: string }>();

			return response.uid;
		}
	} catch (error) {
		console.error('error', error);
		throw error;
	}
}

async function registerSchema(schema: string, signer: JsonRpcSigner) {
	const resolver = zeroAddress; // No resolver
	const revocable = true; // Allow revocations

	console.log('\nSchema details:');
	console.log('- Schema:', schema);
	console.log('- Resolver:', resolver);
	console.log('- Revocable:', revocable);

	// Calculate expected schema UID
	const schemaUID = keccak256(
		encodePacked(['string', 'address', 'bool'], [schema, resolver, revocable]),
	);

	console.log('\nExpected Schema UID:', schemaUID);

	const schemaRegistry = new SchemaRegistry(config.registry[hardhat.id]);
	schemaRegistry.connect(signer);

	// Check if schema already exists FIRST
	const existingSchema = await schemaRegistry
		.getSchema({ uid: schemaUID })
		.catch((error) => {
			console.warn(error);
			return null;
		});

	if (existingSchema?.uid && existingSchema.uid !== zeroHash) {
		console.log('\n✅ Schema already registered!');
		console.log('Schema UID:', existingSchema.uid);
		return schemaUID;
	}

	// Register the schema only if it doesn't exist
	console.log('\n📝 Registering schema...');
	const tx = await schemaRegistry.register({
		schema,
		resolverAddress: resolver,
		revocable,
	});
	console.log('Transaction hash:', tx);

	await tx.wait();
	console.log('✅ Schema registered successfully!');

	// Verify registration
	const registeredSchema = await schemaRegistry.getSchema({ uid: schemaUID });
	console.log('\n✅ Verification:');
	console.log('Schema UID:', registeredSchema.uid);
	console.log('Schema:', registeredSchema.schema);
	console.log('Resolver:', registeredSchema.resolver);
	console.log('Revocable:', registeredSchema.revocable);

	return schemaUID;
}
