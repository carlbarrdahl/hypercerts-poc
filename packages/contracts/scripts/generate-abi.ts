import { promises as fs } from "fs";
import path from "path";

type AbiItem = Record<string, unknown>;

type ContractEntry = {
  address: string;
  abi: AbiItem[];
};

type ContractsByName = Record<string, ContractEntry>;

type DeploymentsOutput = Record<string, ContractsByName>;

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content) as T;
}

function parseChainIdFromDirName(dirName: string): number | null {
  // Expected pattern: chain-<id>
  const match = dirName.match(/chain-(\d+)/);
  return match ? Number(match[1]) : null;
}

async function readChainIdFromJournal(
  journalPath: string
): Promise<number | null> {
  try {
    const content = await fs.readFile(journalPath, "utf-8");
    // The journal is JSONL; find the first line with a chainId
    for (const line of content.split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        if (typeof obj.chainId === "number") return obj.chainId;
      } catch {
        // ignore non-JSON lines
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function discoverChainDirectories(
  deploymentsRoot: string
): Promise<string[]> {
  const entries = await fs.readdir(deploymentsRoot, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => path.join(deploymentsRoot, e.name));
}

async function collectContractsForChain(
  chainDir: string
): Promise<{ chainId: number; contracts: ContractsByName } | null> {
  const dirName = path.basename(chainDir);
  let chainId = parseChainIdFromDirName(dirName);
  if (!chainId) {
    const journalPath = path.join(chainDir, "journal.jsonl");
    chainId =
      (await readChainIdFromJournal(journalPath)) ??
      (undefined as unknown as number);
  }
  if (!chainId) return null;

  const deployedAddressesPath = path.join(chainDir, "deployed_addresses.json");
  if (!(await pathExists(deployedAddressesPath))) return null;

  type DeployedAddresses = Record<string, string>;
  const deployed = await readJson<DeployedAddresses>(deployedAddressesPath);

  const artifactsDir = path.join(chainDir, "artifacts");
  const contracts: ContractsByName = {};

  for (const [moduleAndName, address] of Object.entries(deployed)) {
    try {
      // moduleAndName like "CounterModule#Counter"
      const artifactPath = path.join(artifactsDir, `${moduleAndName}.json`);
      const artifact = await readJson<{ contractName: string; abi: AbiItem[] }>(
        artifactPath
      );
      const contractName =
        artifact.contractName ||
        moduleAndName.split("#").pop() ||
        moduleAndName;
      contracts[contractName] = { address, abi: artifact.abi };
    } catch (err) {
      console.warn(
        `Warning: failed to load artifact for ${moduleAndName} at chain dir ${dirName}:`,
        err
      );
    }
  }

  return { chainId, contracts };
}

async function ensureDirectoryForFile(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function writeOutput(
  destinations: string[],
  data: DeploymentsOutput
): Promise<void> {
  for (const dest of destinations) {
    try {
      await ensureDirectoryForFile(dest);
      const ext = path.extname(dest).toLowerCase();
      if (ext === ".ts" || ext === ".tsx") {
        const content = `export const deployments = ${JSON.stringify(data, null, 2)} as const;\n`;
        await fs.writeFile(dest, content, "utf-8");
      } else if (ext === ".json" || !ext) {
        await fs.writeFile(dest, JSON.stringify(data, null, 2), "utf-8");
      } else {
        // Default to JSON for unknown extensions
        await fs.writeFile(dest, JSON.stringify(data, null, 2), "utf-8");
      }
      console.log(`Wrote deployments to ${dest}`);
    } catch (err) {
      console.error(`Failed to write output to ${dest}:`, err);
    }
  }
}

async function main(): Promise<void> {
  // Allow passing destination paths as CLI args; fallback to sensible defaults inside the repo
  const destinationsFromArgs = process.argv.slice(2).filter(Boolean);

  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const defaultDestinations = [
    path.join(repoRoot, "apps", "hypercerts", "contracts", "deployments.json"),
    path.join(repoRoot, "packages", "contracts", "deployments.json"),
    path.join(repoRoot, "packages", "sdk", "src", "deployments.json"),
    path.join(repoRoot, "packages", "indexer", "abis", "deployments.json"),
  ];

  const destinations =
    destinationsFromArgs.length > 0
      ? destinationsFromArgs
      : defaultDestinations;

  const deploymentsRoot = path.resolve(
    __dirname,
    "..",
    "ignition",
    "deployments"
  );
  if (!(await pathExists(deploymentsRoot))) {
    throw new Error(`Deployments folder not found: ${deploymentsRoot}`);
  }

  const chainDirs = await discoverChainDirectories(deploymentsRoot);
  const output: DeploymentsOutput = {};

  for (const chainDir of chainDirs) {
    const result = await collectContractsForChain(chainDir);
    if (!result) continue;
    const { chainId, contracts } = result;
    if (Object.keys(contracts).length === 0) continue;
    output[String(chainId)] = contracts;
  }

  if (Object.keys(output).length === 0) {
    console.warn("No deployments found; output will be an empty object.");
  }

  await writeOutput(destinations, output);
}

// Run
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
