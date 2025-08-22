import ky from 'ky';
import { Logger } from './lib/logger';

export { HypercertsProvider, useHypercerts } from './components/provider';

const HYPERCERTS_URL = 'http://localhost:3000';

const api = ky.create({
	prefixUrl: HYPERCERTS_URL,
});

const setAuthHeader = (accessToken: string): void => {
	if (!accessToken) return;
	localStorage.setItem('accessToken', accessToken);
	api.extend({ headers: { Authorization: `Bearer ${accessToken}` } });
};

setAuthHeader(localStorage.getItem('accessToken') || '');

export class HypercertSDK {
	account = {
		link: async (data: {
			address: string;
			redirectUrl: string;
		}): Promise<string> => {
			Logger.info('Linking account', data);

			return `${HYPERCERTS_URL}/account/link?address=${data.address}&redirectUrl=${encodeURIComponent(data.redirectUrl)}`;
		},
		setAccessToken: (accessToken: string): void => {
			setAuthHeader(accessToken);
		},
		get: async (address: string): Promise<any> => {
			Logger.info('Getting account', address);
			return ky
				.post(`http://localhost:3000/api/account/get`, { json: { address } })
				.json();
		},
	};
	cert = {
		create: async (data: {}): Promise<string> => {
			Logger.info('Creating certificate', data);
			return '';
		},
	};
	organization = {
		create: (data: { name: string; description: string }): void => {
			Logger.info('Creating organization', data);
			// Deploy Safe contract via protocolKit with threshold 1
		},
		list: async (): Promise<{}> => {
			Logger.info('Listing organizations');
			return ky
				.post(`http://localhost:3000/api/organization/list`, { json: {} })
				.json();
		},
		updateMembers: async (data: {
			op: 'add' | 'remove';
			address: string;
		}): Promise<void> => {
			Logger.info('Updating organization members', data);
			// Add or remove member from Safe contract
		},
	};
}
