'use client';

import {
	createContext,
	useContext,
	useState,
	type PropsWithChildren,
} from 'react';
import { HypercertSDK } from '..';

const HypercertsContext = createContext<HypercertsContextType>({
	sdk: null,
});

type HypercertsContextType = {
	sdk: HypercertSDK | null;
};

export function HypercertsProvider({
	children,
}: PropsWithChildren): React.ReactNode {
	const [sdk, setSdk] = useState<HypercertSDK | null>(new HypercertSDK());
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
