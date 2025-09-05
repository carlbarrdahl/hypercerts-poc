// MultiOwnerLightAccount ABI
export const MULTI_OWNER_LIGHT_ABI = [
  {
    name: "addOwner",
    type: "function",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "updateOwners",
    type: "function",
    inputs: [
      {
        name: "ownersToAdd",
        type: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "removeOwner",
    type: "function",
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "getOwners",
    type: "function",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
  },
] as const;

// MultiOwnerModule ABI for Safe compatibility
export const MULTI_OWNER_MODULE_ABI = [
  {
    name: "enableModule",
    type: "function",
    inputs: [
      {
        name: "module",
        type: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    name: "setOwnersAndThreshold",
    type: "function",
    inputs: [
      {
        name: "owners",
        type: "address[]",
      },
      {
        name: "threshold",
        type: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;


