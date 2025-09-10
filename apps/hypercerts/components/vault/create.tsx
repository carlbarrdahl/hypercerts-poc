"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Address, getAddress, parseUnits, zeroAddress } from "viem";
import { HyperVaultConfig, useHypercerts } from "@workspace/sdk";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const formSchema = z.object({
  parent: z.string().optional(),
  shares: z.string().optional(),
  asset: z.string().min(1, "Asset address is required"),
  percent: z
    .string()
    .min(1, "Percent is required")
    .max(100, "Percent must be less than 100"),
  metadata: z
    .string()
    .min(1, "Metadata is required")
    .max(1000, "Metadata must be less than 1000 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateVault() {
  const { sdk } = useHypercerts();
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parent: zeroAddress,
      asset: sdk?.test?.token || zeroAddress,
      percent: "100",
      metadata: "",
      shares: "0", //parseUnits("100", 18).toString(),
    },
  });

  const create = useMutation({
    mutationFn: async (config: HyperVaultConfig) => sdk?.vault.create(config),
    onSuccess: (cert) => {
      console.log("cert", cert);
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      router.push(`/certs/${cert}`);
      toast.success("Vault created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error creating vault");
    },
  });

  const onSubmit = (values: FormValues) => {
    const config: HyperVaultConfig = {
      parent: zeroAddress,
      owner: address,
      asset: getAddress(values.asset),
      percent: BigInt(Math.floor((parseFloat(values.percent) / 100) * 10000)),
      metadata: values.metadata,
      shares: BigInt(values.shares ?? "0"),
    };

    console.log("config", config);
    create.mutate(config);
  };

  return (
    <Card className="max-w-md space-y-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Create Vault</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure your vault settings and create a new HyperVault.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <FormField
            control={form.control}
            name="parent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Vault (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0x0000000000000000000000000000000000000000"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The parent vault address. Leave empty for root vault.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormDescription>
                    The ERC20 token address to be held in the Hypercert.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
            control={form.control}
            name="percent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="100"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Percentage of the vault allocation (0-100%).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

            <FormField
              control={form.control}
              name="metadata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadata</FormLabel>
                  <FormControl>
                    <Input placeholder="Vault description or name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Descriptive metadata for your vault.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={create.isPending}
            >
              {create.isPending ? "Creating..." : "Create Vault"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
