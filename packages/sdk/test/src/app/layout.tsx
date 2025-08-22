import type { Metadata } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import './globals.css'

const fontSans = Inter({
	variable: '--font-sans',
	subsets: ['latin'],
})

const fontMono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'sdk-react test app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	)
}
