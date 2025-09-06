"use client";

import { Button } from "@workspace/ui/components/button";
import { LogOut } from "lucide-react";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { burner } from "burner-connector";
import { FaucetButton } from "./dev/faucet-button";

export function LoginButton() {
  const account = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  if (account.isConnected) {
    return (
      <div className="flex items-center gap-2">
<FaucetButton />
      <Button variant="default" onClick={() => disconnect()}>
        Disconnect
      </Button>
      </div>
    );
  }
  return (
    <Button
      variant="default"
      onClick={() =>
        connect({
          connector: burner(),
        })
      }
    >
      Connect (dev)
    </Button>
  );
}

function LoginButtonAccountKit() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { isInitializing } = useSignerStatus();
  const { logout } = useLogout();

  if (isInitializing) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  console.log(user);

  if (user) {
    const displayName = user.email || user.address;
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="hidden sm:flex"
          icon={() => (
            <img
              src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.address}`}
              width={16}
              height={16}
              alt="User avatar"
              className="rounded-full mr-2"
            />
          )}
        >
          {displayName}
        </Button>

        <Button variant="outline" onClick={() => logout()} icon={LogOut}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button variant="default" onClick={openAuthModal}>
      Login
    </Button>
  );
}
