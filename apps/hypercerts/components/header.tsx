import Link from "next/link";
import { LoginButton } from "./login-button";
import { Button } from "@workspace/ui/components/button";

export function Header() {
  return (
    <header className="flex items-center justify-between p-2">
      <Link href="/">
        <h1 className="text-sm font-bold">Hypercerts</h1>
      </Link>
      <div className="w-full flex items-center justify-center gap-1">
        <Link href="/solutions">
          <Button variant="link">Solutions</Button>
        </Link>
        <Link href="/regions">
          <Button variant="link">Regions</Button>
        </Link>
        <Link href="/certs/create">
          <Button variant="link">Create Project</Button>
        </Link>
      </div>
      <LoginButton />
    </header>
  );
}
