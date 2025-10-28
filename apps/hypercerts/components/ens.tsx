import { ComponentProps } from "react";
import { Address } from "viem";
import { useEnsAvatar, useEnsName } from "wagmi";
import { normalize } from "viem/ens";
import { truncate } from "@/lib/truncate";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

export function EnsName({ address }: { address?: Address }) {
  const { data: name } = useEnsName({
    address,
    chainId: 1,
    query: { enabled: Boolean(address) },
  });

  return <>{name ?? truncate(address, 13)}</>;
}

export function EnsAvatar({
  address,
  ...props
}: { address: string } & ComponentProps<typeof Avatar>) {
  const { data: name } = useEnsName({
    address: address as Address,
    chainId: 1,
    query: { enabled: Boolean(address) },
  });

  const { data: src } = useEnsAvatar({
    chainId: 1,
    name: normalize(name!),
    query: { enabled: Boolean(name) },
  });
  return (
    <Avatar {...props}>
      <AvatarImage src={src!} alt={name ?? address} />
      <AvatarFallback className="bg-gray-100 dark:bg-gray-800"></AvatarFallback>
    </Avatar>
  );
}
