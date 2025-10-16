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
	zeroHash,
} from 'viem';
import {
	EAS,
	SchemaEncoder,
	NO_EXPIRATION,
	TransactionSigner,
	SchemaRegistry,
} from '@ethereum-attestation-service/eas-sdk';
import deployments from '../deployments.json';
import { clientToSigner } from './viem-to-ethers';
import { baseSepolia, hardhat } from 'viem/chains';
import { z } from 'zod';
import { Logger } from './logger';
import { waitForTransactionReceipt } from 'viem/actions';
import { INDEXER_URL } from './graphql';
import ky from 'ky';
const schemaUID =
	'0x7876d5406011830fa45bdfb6c7751d94a3c1477538f6a98f2668c2ab2bf898cd';

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
		const metadataURI = 'metadataCid';
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

			await registerSchema(schema, signer);

			return eas
				.attest({
					schema: schemaUID,
					data: defaultAttestation,
				})
				.then((tx) => tx.wait());
		} else {
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

async function registerSchema(schema: string, signer: Signer) {
	const resolver = zeroAddress; // No resolver
	const revocable = true; // Allow revocations

	console.log('\nSchema details:');
	console.log('- Schema:', schema);
	console.log('- Resolver:', resolver);
	console.log('- Revocable:', revocable);

	// Check if schema already exists
	// Calculate expected schema UID
	const schemaUID = keccak256(
		encodeAbiParameters(
			[
				{ type: 'string', name: 'schema' },
				{ type: 'address', name: 'resolver' },
				{ type: 'bool', name: 'revocable' },
			],
			[schema, resolver, revocable],
		),
	);

	console.log('\nExpected Schema UID:', schemaUID);

	// const schemaRegistryContractAddress = '0xYourSchemaRegistryContractAddress';
	const schemaRegistry = new SchemaRegistry(config.registry[hardhat.id]);
	// const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

	schemaRegistry.connect(signer);

	const transaction = await schemaRegistry.register({
		schema,
		resolverAddress: zeroAddress,
		revocable,
	});

	// Optional: Wait for transaction to be validated
	await transaction.wait();
	console.log('\nExpected Schema UID:', schemaUID);

	const existingSchema = await schemaRegistry.getSchema({ uid: schemaUID });
	if (existingSchema.uid !== zeroHash) {
		console.log('\n✅ Schema already registered!');
		console.log('Schema UID:', existingSchema.uid);
		return;
	}

	// Register the schema
	console.log('\n📝 Registering schema...');
	const tx = await schemaRegistry.register(schema, resolver, revocable);
	console.log('Transaction hash:', tx.hash);

	const receipt = await tx.wait();
	console.log('✅ Schema registered successfully!');

	// Get the registered schema UID from the event
	const registeredEvent = receipt?.log.find((log: any) => {
		try {
			const parsed = SchemaRegistry.interface.parseLog(log);
			return parsed?.name === 'Registered';
		} catch {
			return false;
		}
	});

	if (registeredEvent) {
		const parsed = SchemaRegistry.interface.parseLog(registeredEvent);
		console.log('\n📋 Registered Schema Details:');
		console.log('Schema UID:', parsed?.args.uid);
		console.log('Registerer:', parsed?.args.registerer);
	}

	// Verify registration
	const registeredSchema = await SchemaRegistry.getSchema(schemaUID);
	console.log('\n✅ Verification:');
	console.log('Schema UID:', registeredSchema.uid);
	console.log('Schema:', registeredSchema.schema);
	console.log('Resolver:', registeredSchema.resolver);
	console.log('Revocable:', registeredSchema.revocable);
}
