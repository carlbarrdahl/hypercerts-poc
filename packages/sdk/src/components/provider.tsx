'use client';

import {
	createContext,
	useContext,
	useState,
	type PropsWithChildren,
} from 'react';
import { HypercertsSDK } from '..';
import { WalletClient } from 'viem';

const HypercertsContext = createContext<HypercertsContextType>({
	sdk: null,
});

type HypercertsContextType = {
	sdk: HypercertsSDK | null;
};

export function HypercertsProvider({
	children,
	client,
}: PropsWithChildren<{ client?: WalletClient }>): React.ReactNode {
	const [sdk] = useState<HypercertsSDK | null>(new HypercertsSDK(client));
	console.log('Initializing HypercertsProvider', sdk);
	return (
		<HypercertsContext.Provider value={{ sdk }}>
			{children}
		</HypercertsContext.Provider>
	);
}

export function useHypercerts(): HypercertsContextType {
	const context = useContext(HypercertsContext);
	if (!context) {
		throw new Error('useHypercerts must be used within a HypercertsProvider');
	}
	return context;
}
