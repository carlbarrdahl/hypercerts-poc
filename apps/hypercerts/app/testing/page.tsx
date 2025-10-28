// pages/index.tsx
import React from "react";
import { AddOwners } from "@/components/update-owners";

export default function TestingPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Testing MultiOwnerLightAccount</h1>
      
      <div className="max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Owners to MultiOwnerLightAccount</h2>
        <AddOwners />
      </div>
    </div>
  );
}
