"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function AccountPage() {
  const { user } = usePrivy();
  return (
    <div>
      <h3 className="font-bold mb-4">Account Page</h3>
      <div></div>
      <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
