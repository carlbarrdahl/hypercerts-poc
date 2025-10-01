import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { MintTokens } from "@/components/dev/mint-tokens";
import { cookieToInitialState } from "@account-kit/core";
import { headers } from "next/headers";
import { config } from "@/config";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    config,
    (await headers()).get("cookie") ?? undefined
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers initialState={initialState}>
          <main className="max-w-screen-lg mx-auto min-h-svh">
            <Header />
            {children}

            <div className="mt-10">{/* <MintTokens /> */}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
