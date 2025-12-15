"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@workspace/ui/components/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useFetchKML } from "@/hooks/use-fetch-kml";
import { useEffect } from "react";
import { getAddress, zeroAddress } from "viem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { BannerImage } from "../banner-image";

const formSchema = z.object({
  parent: z.string().optional(),
  shares: z.string().optional(),
  asset: z.string().min(1, "Asset address is required"),
  percent: z
    .string()
    .min(1, "Percent is required")
    .max(100, "Percent must be less than 100"),
  metadata: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    geoJSON: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const PA10_PRESET = {
  title: "West European Coastal Mixed Forests (PA10)",
  description: `The West European Coastal Mixed Forests bioregion is part of the Greater European Forests subrealm located in the Western Eurasia realm (western Palearctic). It contains four ecoregions—Baltic Mixed Forests (647), Cantabrian Mixed Forests (648), European Atlantic Mixed Forests (664), Pyrenees Conifer and Mixed Forests (676)—totaling more than 62 million hectares of land area.

At the junction of Mediterranean and Central Europe lies a landscape sparsely covered by conifer and mixed forests, stretching up the slopes of the Pyrenees mountains.`,
  image:
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e05717c3-7307-4e43-800a-ad08c2e128aa/647%20Baltic%20Mixed%20Forests%20Moahim%20cc.jpg",
  geoJSON: "https://www.oneearth.org/geoData/bioregions/PA10.kml",
};

const AMAZON_RESTORATION_PRESET = {
  title: "Amazon Rainforest Restoration",
  description: `Planting 100,000 native trees across 200 hectares of degraded Amazon rainforest in partnership with Indigenous communities. This project will restore biodiversity and sequester carbon.

The project establishes community nurseries producing native seedlings from 30 different species including Brazil nut, mahogany, and rubber trees. All planting locations are GPS tracked to monitor long-term success and survival rates.`,
  image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
  geoJSON: "https://www.oneearth.org/geoData/bioregions/NT20.kml",
};

const CORAL_REEF_PRESET = {
  title: "Coral Reef Restoration - Borneo",
  description: `Restoring 5 hectares of damaged coral reef in Borneo through coral gardening and transplantation. Working with local fishing communities to establish marine protected areas.

Building underwater coral nurseries with thousands of coral fragments from 15+ species. Monthly monitoring shows excellent growth rates and survival, helping to restore critical marine ecosystems.`,
  image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800",
  geoJSON: "https://www.oneearth.org/geoData/bioregions/IM16.kml",
};

export function CreateCert() {
  const { sdk } = useHypercerts();
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const router = useRouter();
  const tokens = [
    {
      address: sdk?.test?.token,
      name: "USDC",
    },
    {
      address: zeroAddress,
      name: "ETH",
    },
  ];
  console.log("sdk?.test?.token", sdk);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // owner: address,
      parent: zeroAddress,
      asset: sdk?.test?.token,
      percent: "100",
      shares: "0", //parseUnits("100", 18).toString(),
      metadata: {
        title: "",
        description: "",
        image: "",
        geoJSON: "",
      },
    },
  });

  console.log("tokens", tokens);
  console.log(form.watch("asset"));
  const create = useMutation({
    mutationFn: async (config: HyperVaultConfig) => sdk?.vault.create(config),
    onSuccess: (cert) => {
      console.log("cert", cert);
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      router.push(`/projects/${cert}`);
      toast.success("Vault created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error creating vault");
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!address) throw new Error("Wallet not connected");
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

  const loadPreset = (preset: typeof PA10_PRESET, name: string) => {
    form.setValue("metadata.title", preset.title);
    form.setValue("metadata.description", preset.description);
    form.setValue("metadata.image", preset.image);
    form.setValue("metadata.geoJSON", preset.geoJSON);
    toast.success(`${name} preset loaded`);
  };

  return (
    <Card className="max-w-2xl space-y-6">
      <CardHeader>
        <div className="space-y-4">
          <div>
            <CardTitle className="text-lg font-medium">
              Create Certificate
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new hypercert certificate for your bioregion or project.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadPreset(PA10_PRESET, "PA10 Region")}
            >
              Load PA10 Bioregion
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                loadPreset(AMAZON_RESTORATION_PRESET, "Amazon Restoration")
              }
            >
              Load Amazon Project
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadPreset(CORAL_REEF_PRESET, "Coral Reef")}
            >
              Load Coral Reef Project
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="metadata.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter certificate title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, descriptive title for your certificate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter certificate description (supports markdown)"
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A detailed description of the certificate. Markdown is
                    supported.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to the cover image for this certificate.
                  </FormDescription>
                  <BannerImage src={form.watch("metadata.image")} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Address</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.address} value={token.address}>
                            {token.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The ERC20 token address to be held in the Hypercert.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.geoJSON"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KML/GeoJSON URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/region.kml"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to a KML or GeoJSON file defining the geographic region.
                    {/* {isLoadingGeoJSON && (
                      <span className="text-blue-600 ml-2">Loading...</span>
                    )}
                    {geoJSON && (
                      <span className="text-green-600 ml-2">✓ Loaded</span>
                    )} */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={create.isPending}
              loadingText="Creating"
            >
              Create Certificate
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
