"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@workspace/ui/components/button";
import { LogIn, LogOut } from "lucide-react";

export function LoginButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  console.log(user, ready, authenticated);

  if (!ready) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (authenticated && user) {
    const displayName = user.google?.email || user.email?.address || user.wallet?.address || "User";
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="hidden sm:flex"
          icon={() => (
            <img
              src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.id}`}
              width={16}
              height={16}
              alt="User avatar"
              className="rounded-full mr-2"
            />
          )}
        >
          {displayName}
        </Button>

        <Button variant="outline" onClick={logout} icon={LogOut}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button variant="default" onClick={login} icon={LogIn}>
      Login
    </Button>
  );
}
