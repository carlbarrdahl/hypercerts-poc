import {
  ChainConfig,
  loadBalance,
  createConfig,
  rateLimit,
  factory,
} from "ponder";

import { baseSepolia, hardhat } from "viem/chains";
import { Abi, AbiEvent, getAbiItem, http } from "viem";
import deployments from "./abis/deployments.json";

const isDev = process.env.NODE_ENV === "development";

const { HyperVault, HyperVaultFactory, EAS } = deployments[31337];
const START_BLOCKS: Record<number, number> = {
  [hardhat.id]: 0,
  [baseSepolia.id]: 28185306,
};

const rpcURLs = {
  [hardhat.id]: process.env.PONDER_RPC_URL_31337,
  [baseSepolia.id]: process.env.PONDER_RPC_URL_84532,
};
const networks = {
  hardhat,
  // baseSepolia,
};

const chains: Record<string, ChainConfig> = Object.fromEntries(
  Object.entries(networks).map(([name, { id }]) => [
    name,
    {
      id,
      rpc: loadBalance([
        rateLimit(http(rpcURLs[id]), { requestsPerSecond: 5 }),
        rateLimit(http(), { requestsPerSecond: 2 }),
      ]),
    },
  ])
);

const hyperVaultCreatedEvent = getAbiItem({
  abi: HyperVaultFactory.abi as Abi,
  name: "Created",
});

export default createConfig({
  chains,
  contracts: {
    HyperVaultFactory: {
      abi: HyperVaultFactory.abi as Abi,
      chain: "hardhat",
      address: (deployments as any)[31337].HyperVaultFactory.address,
    },
    HyperVault: {
      abi: HyperVault.abi as Abi,
      chain: "hardhat",
      address: factory({
        address: (deployments as any)[31337].HyperVaultFactory.address,
        event: hyperVaultCreatedEvent as AbiEvent,
        parameter: "id",
      }),
    },
    EAS: {
      abi: EAS.abi as Abi,
      chain: "hardhat",
      address: (deployments as any)[31337].EAS.address,
    },
  },
});
