"use client";

/**
 * AddOwners Component
 * 
 * This component allows users to add new owners to their MultiOwnerLightAccount
 * using Alchemy's Account Kit. It provides a simple form interface for adding
 * new owner addresses.
 * 
 * Features:
 * - Validates Ethereum addresses
 * - Uses Alchemy Account Kit's useSendUserOperation for gasless transactions
 * - Provides loading states and error handling
 * - Shows success/error notifications via toast
 * 
 * Usage:
 * ```tsx
 * import { AddOwners } from "@/components/add-owners";
 * 
 * function MyPage() {
 *   return <AddOwners />;
 * }
 * ```
 * 
 * Requirements:
 * - User must have a connected MultiOwnerLightAccount
 * - User must be an existing owner to add new owners
 * - Requires Alchemy Account Kit configuration
 */

import { useState } from "react";
import { useAccount, useSmartAccountClient, useSendUserOperation } from "@account-kit/react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import { isAddress, encodeFunctionData } from "viem";
import { MULTI_OWNER_LIGHT_ABI } from "@/contracts/abis";

export function UpdateOwners() {
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  const account = useAccount({
    type: "MultiOwnerLightAccount",
  });
  const { client } = useSmartAccountClient({});
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({ 
    client, 
    waitForTxn: true 
  });

  const handleAddOwner = async () => {
    if (!account?.address) {
      toast.error("No account connected");
      return;
    }

    if (!newOwnerAddress.trim()) {
      toast.error("Please enter an address");
      return;
    }

    if (!isAddress(newOwnerAddress.trim())) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    try {
      setIsAdding(true);
      
      // Encode the function call data for updateOwners
      const data = encodeFunctionData({
        abi: MULTI_OWNER_LIGHT_ABI,
        functionName: "updateOwners",
        args: [[newOwnerAddress.trim() as `0x${string}`]],
      });

      // Send the user operation
      await sendUserOperation({
        uo: {
          target: account.address,
          data,
          value: 0n,
        },
      });

      toast.success("Owner added successfully!");
      setNewOwnerAddress("");
    } catch (error) {
      console.error("Error adding owner:", error);
      toast.error("Failed to add owner. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddOwner();
    }
  };

  if (!account?.address) {
    return (
      <div className="p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Add Owners</h3>
        <p className="text-muted-foreground">Please connect your MultiOwnerLightAccount to add owners.</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Add Owners</h3>
        <p className="text-sm text-muted-foreground">
          Add new owners to your MultiOwnerLightAccount. Only existing owners can add new owners.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="owner-address">New Owner Address</Label>
        <Input
          id="owner-address"
          type="text"
          placeholder="0x..."
          value={newOwnerAddress}
          onChange={(e) => setNewOwnerAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isAdding || isSendingUserOperation}
        />
      </div>

      <Button 
        onClick={handleAddOwner} 
        disabled={isAdding || isSendingUserOperation || !newOwnerAddress.trim()}
        className="w-full"
      >
        {isAdding || isSendingUserOperation ? "Adding Owner..." : "Add Owner"}
      </Button>

      <div className="text-xs text-muted-foreground">
        <p>Current Account: {account.address}</p>
      </div>
    </div>
  );
}