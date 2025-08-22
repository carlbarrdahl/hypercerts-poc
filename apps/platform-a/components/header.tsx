"use client";
import Link from "next/link";
import { ConnectKitButton } from 'connectkit';

export function Header() {
  return (
    <header className="flex items-center justify-between p-2">
      <Link href="/">
        <h1 className="text-sm font-bold">Platform A</h1>
      </Link>
      <ConnectKitButton />
    </header>
  );
}