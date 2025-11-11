"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HyperVaultConfig, useHypercerts, useListHypercerts } from "@workspace/sdk";
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
import { getAddress, zeroAddress, Address } from "viem";
import { BannerImage } from "../banner-image";
import { oneEarthFramework } from "@/lib/pathway-data";
import { generatePathwaySlug, findPathwayBySlug } from "@/lib/pathway-utils";
import { PathwaySelector } from "../pathway-selector";
import { Zap, Leaf, Sprout, ArrowRight, ArrowLeft, Check } from "lucide-react";
import {
  calculateVaultLevel,
  getVaultLevelLabel,
} from "@workspace/sdk";

const pillarIcons = {
  "energy-transition": Zap,
  "nature-conservation": Leaf,
  "regenerative-agriculture": Sprout,
};

const projectFormSchema = z.object({
  pathwaySlug: z.string().min(1, "Pathway selection is required"),
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
    fundingGoal: z.string().optional(),
  }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type Step = "pathway" | "details" | "review";

export function CreateProjectFlow() {
  const { sdk } = useHypercerts();
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("pathway");
  const [selectedPathwaySlug, setSelectedPathwaySlug] = useState<string>("");
  const [pathwayVaultAddress, setPathwayVaultAddress] = useState<Address | null>(null);

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

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      pathwaySlug: "",
      asset: sdk?.test?.token,
      percent: "10", // Default 10% upstream
      metadata: {
        title: "",
        description: "",
        image: "",
        geoJSON: "",
        fundingGoal: "",
      },
    },
  });

  // Find pathway vault by matching pathway name
  const { data: allVaults } = useListHypercerts({});
  
  // When pathway slug is selected, find the corresponding vault
  const pathwayData = selectedPathwaySlug
    ? findPathwayBySlug(oneEarthFramework, selectedPathwaySlug)
    : null;

  // Find pathway vault by matching title
  useQuery({
    queryKey: ["pathway-vault", selectedPathwaySlug],
    queryFn: async () => {
      if (!pathwayData || !allVaults?.items) return null;
      
      // Find vault with matching title (pathway name)
      const pathwayVault = allVaults.items.find((vault) => {
        const level = calculateVaultLevel(
          vault,
          vault.parent ? allVaults.items.find((v) => v.id === vault.parent) : null
        );
        return (
          level === 2 && // Pathway level
          vault.metadata?.title === pathwayData.pathway.name
        );
      });

      if (pathwayVault) {
        setPathwayVaultAddress(pathwayVault.id as Address);
        return pathwayVault.id as Address;
      }
      return null;
    },
    enabled: Boolean(selectedPathwaySlug && pathwayData && allVaults?.items),
  });

  const create = useMutation({
    mutationFn: async (config: HyperVaultConfig) => {
      if (!sdk) throw new Error("SDK not initialized");
      return sdk.vault.create(config);
    },
    onSuccess: (vaultAddress) => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      router.push(`/certs/${vaultAddress}`);
      toast.success("Project created successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error creating project. Please try again.");
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!pathwayVaultAddress) {
      toast.error("Pathway vault not found. Please try selecting the pathway again.");
      return;
    }

    const config: HyperVaultConfig = {
      parent: pathwayVaultAddress,
      owner: address,
      asset: getAddress(values.asset),
      percent: BigInt(Math.floor((parseFloat(values.percent) / 100) * 10000)),
      metadata: {
        ...values.metadata,
        pathwaySlug: values.pathwaySlug,
        vaultType: "project",
      },
      shares: BigInt(0),
    };

    create.mutate(config);
  };

  const handlePathwaySelect = (slug: string) => {
    setSelectedPathwaySlug(slug);
    form.setValue("pathwaySlug", slug);
    setCurrentStep("details");
  };

  const handleNext = () => {
    if (currentStep === "pathway") {
      if (!selectedPathwaySlug) {
        toast.error("Please select a pathway");
        return;
      }
      setCurrentStep("details");
    } else if (currentStep === "details") {
      form.trigger().then((isValid) => {
        if (isValid) {
          setCurrentStep("review");
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep === "details") {
      setCurrentStep("pathway");
    } else if (currentStep === "review") {
      setCurrentStep("details");
    }
  };

  const pathwayInfo = pathwayData ? (
    <div className="p-4 bg-muted/50 border border-border rounded-lg">
      <div className="flex items-start gap-3">
        {pillarIcons[pathwayData.pillar.id as keyof typeof pillarIcons] && (
          <div className="p-2 bg-foreground/5 rounded-lg flex-shrink-0">
            {(() => {
              const Icon =
                pillarIcons[pathwayData.pillar.id as keyof typeof pillarIcons];
              return <Icon className="w-4 h-4" />;
            })()}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">
            {pathwayData.pathway.name}
          </h4>
          <p className="text-xs text-muted-foreground mb-2">
            {pathwayData.pathway.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-foreground/5 rounded-full">
              {pathwayData.pillar.name}
            </span>
            <span className="text-xs px-2 py-1 bg-muted/50 rounded-full">
              {pathwayData.subPillar.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">
              Create Project
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Apply your project to a solution pathway and start tracking impact
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={`px-2 py-1 rounded-full ${
                currentStep === "pathway"
                  ? "bg-foreground text-background"
                  : selectedPathwaySlug
                  ? "bg-muted"
                  : "bg-muted/50"
              }`}
            >
              1. Pathway
            </span>
            <ArrowRight className="w-3 h-3" />
            <span
              className={`px-2 py-1 rounded-full ${
                currentStep === "details"
                  ? "bg-foreground text-background"
                  : currentStep === "review"
                  ? "bg-muted"
                  : "bg-muted/50"
              }`}
            >
              2. Details
            </span>
            <ArrowRight className="w-3 h-3" />
            <span
              className={`px-2 py-1 rounded-full ${
                currentStep === "review"
                  ? "bg-foreground text-background"
                  : "bg-muted/50"
              }`}
            >
              3. Review
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Select Pathway */}
            {currentStep === "pathway" && (
              <div className="space-y-4">
                <div>
                  <FormLabel className="text-base font-medium">
                    Select a Solution Pathway
                  </FormLabel>
                  <FormDescription className="mt-1">
                    Choose the pathway your project will contribute to. This
                    connects your project to the OneEarth Solutions Framework.
                  </FormDescription>
                </div>
                <div className="space-y-4">
                  <PathwaySelector
                    onSelect={handlePathwaySelect}
                    currentPathwaySlug={selectedPathwaySlug}
                  />
                </div>
                {pathwayInfo}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedPathwaySlug}
                  >
                    Next: Project Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === "details" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-1">
                    Project Details
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This project will apply to:{" "}
                    <span className="font-medium">
                      {pathwayData?.pathway.name}
                    </span>
                  </p>
                </div>

                {pathwayInfo}

                <FormField
                  control={form.control}
                  name="metadata.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your project title"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, descriptive title for your project.
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project and how it contributes to the pathway mission..."
                          className="min-h-32 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain how your project aligns with the pathway goals.
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
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL to a cover image for your project.
                      </FormDescription>
                      <BannerImage src={form.watch("metadata.image")} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metadata.fundingGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10000"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional funding goal in the selected token.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="asset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={field.onChange}
                          value={field.value}
                        >
                          {tokens.map((token) => (
                            <option key={token.address} value={token.address}>
                              {token.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>
                        The token used for funding this project.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="percent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upstream Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Percentage of funding that flows upstream to the
                        pathway (default: 10%).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext}>
                    Next: Review
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Create */}
            {currentStep === "review" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-1">Review & Create</h3>
                  <FormDescription>
                    Review your project details before creating.
                  </FormDescription>
                </div>

                {pathwayInfo}

                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Project Title:
                    </span>
                    <p className="text-sm mt-1">
                      {form.watch("metadata.title")}
                    </p>
                  </div>
                  {form.watch("metadata.description") && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Description:
                      </span>
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {form.watch("metadata.description")}
                      </p>
                    </div>
                  )}
                  {form.watch("metadata.fundingGoal") && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Funding Goal:
                      </span>
                      <p className="text-sm mt-1">
                        {form.watch("metadata.fundingGoal")}{" "}
                        {tokens.find(
                          (t) => t.address === form.watch("asset")
                        )?.name}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Upstream Percentage:
                    </span>
                    <p className="text-sm mt-1">
                      {form.watch("percent")}%
                    </p>
                  </div>
                </div>

                {!pathwayVaultAddress && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Pathway vault not found. Please ensure the pathway has
                      been seeded.
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!pathwayVaultAddress || create.isPending}
                    isLoading={create.isPending}
                    loadingText="Creating..."
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

