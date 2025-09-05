import { watchSmartAccountClient } from "@account-kit/core";
import { config } from "@/config";

export function watchUserAccount(ownerAddress: `0x${string}`, onChange: any) {
  // User’s canonical account
  return watchSmartAccountClient(
    { type: "MultiOwnerLightAccount", owner: ownerAddress },
    config
  )(onChange);
}

export function watchOrganization(
  primaryOwner: `0x${string}`,
  salt: bigint,
  onChange: any
) {
  // Org multisig (ModularAccount v2); address is derived from (owner, salt) unless you pass accountAddress
  return watchSmartAccountClient(
    { type: "ModularAccountV2", owner: primaryOwner, salt },
    config
  )(onChange);
}
