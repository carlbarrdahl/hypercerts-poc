import { Geist, IBM_Plex_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { MintTokens } from "@/components/dev/mint-tokens";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  adjustFontFallback: false,
  preload: false,
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` font-sans antialiased `}>
        <Providers>
          <main className="max-w-screen-lg mx-auto min-h-svh">
            <Header />
            {children}

            <div className="mt-10">
              <MintTokens />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
