import { Geist, IBM_Plex_Mono } from "next/font/google";
import { Metadata } from "next";
import "@workspace/ui/globals.css";
// import { Providers } from "@/components/providers";
import { Providers } from "@/components/providers-local";
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

export const metadata = {
  title: "HyperFund",
  description: "HyperFund",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` font-sans antialiased `}>
        <Providers>
          <main className="max-w-screen-xl mx-auto min-h-svh">
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
