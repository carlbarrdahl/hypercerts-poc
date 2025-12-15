"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
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
import {
  useHypercertsCreateAttestation,
  useHypercertsAttestations,
} from "@workspace/sdk";
import { Address } from "viem";
import { EnsName } from "../ens";
import { truncate } from "@/lib/truncate";
import { timeAgo } from "@/lib/format";
import { useAccount } from "wagmi";
import {
  CheckCircle2,
  XCircle,
  Plus,
  Award,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Markdown } from "../markdown";

type Visibility = "private" | "organization" | "draft" | "published";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  src: z.string().url("Must be a valid URL"),
  mime: z.string().min(1, "MIME type is required"),
});

const attestationFormSchema = z.object({
  type: z.string().min(1, "Type is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      {
        message: "Must be a valid URL",
      }
    ),
  geoJSON: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      {
        message: "Must be a valid URL",
      }
    ),
  visibility: z.enum(["private", "organization", "draft", "published"]),
  refUID: z.string().optional(),
  verified: z.boolean().optional(),
  resources: z.array(resourceSchema).optional(),
});

type AttestationFormValues = z.infer<typeof attestationFormSchema>;

export function Attestations({ id }: { id: Address }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAttestation, setSelectedAttestation] = useState<any | null>(
    null
  );
  const [selectedForVerification, setSelectedForVerification] = useState<
    Set<string>
  >(new Set());
  const [showBatchVerify, setShowBatchVerify] = useState(false);
  const { address } = useAccount();

  const { data, error, isPending, isRefetching } = useHypercertsAttestations(
    {
      orderBy: "createdAt",
      orderDirection: "desc",
      where: {
        recipient: id,
      },
    },
    {
      refetchInterval: 1000,
    }
  );

  // Filter work claims for batch verification (only work claims can be verified)
  const verifiableItems =
    data?.items?.filter((item) => {
      const parsed = item.decodedParsed as any;
      return parsed?.type === "work-claim";
    }) || [];

  const toggleSelection = (itemId: string) => {
    const newSelection = new Set(selectedForVerification);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedForVerification(newSelection);
  };

  console.log(1212312, data);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Attestations</CardTitle>
          <div className="flex gap-2">
            {selectedForVerification.size > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowBatchVerify(true)}
                disabled={!address}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verify Selected ({selectedForVerification.size})
              </Button>
            )}
            <Button onClick={() => setShowCreateDialog(true)} disabled={!id}>
              <Plus className="w-4 h-4 mr-2" />
              Create Attestation
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!data?.items?.length ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No attestations yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attester</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items?.map((item, i) => {
                const parsed = item.decodedParsed as any;
                const isMilestone = parsed?.type === "milestone";
                const isVerification = parsed?.type === "verification";
                const isWorkClaim = parsed?.type === "work-claim";
                const isVerifiable = isWorkClaim; // Only work claims can be verified

                // Parse metadata
                let metadata: any = {};
                if (parsed?.metadata) {
                  try {
                    metadata =
                      typeof parsed.metadata === "string"
                        ? JSON.parse(parsed.metadata)
                        : parsed.metadata;
                  } catch (e) {
                    metadata = {};
                  }
                }

                // Count verifications for this item
                const verificationCount =
                  data?.items?.filter((v) => {
                    const vParsed = v.decodedParsed as any;
                    if (vParsed?.type !== "verification") return false;
                    return v.refUID === item.id;
                  }).length || 0;

                return (
                  <TableRow
                    key={i}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== "INPUT") {
                        setSelectedAttestation(item);
                      }
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {isVerifiable && (
                        <input
                          type="checkbox"
                          checked={selectedForVerification.has(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="cursor-pointer"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {metadata?.image ? (
                        <div className="w-12 h-12 rounded overflow-hidden bg-muted border">
                          <img
                            src={metadata.image}
                            alt={metadata.title || "Attestation"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted/30 border flex items-center justify-center">
                          <Award className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isMilestone ? (
                          <Award className="w-4 h-4 text-blue-500" />
                        ) : isVerification ? (
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                        ) : null}
                        <span className="text-sm font-medium capitalize">
                          {parsed?.type || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {metadata?.title || "—"}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-muted-foreground truncate">
                        <Markdown>{metadata?.description || "—"}</Markdown>
                      </p>
                    </TableCell>
                    <TableCell>
                      {isVerification ? (
                        <div className="flex items-center gap-1.5">
                          {metadata?.verified ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">
                                Verified
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600 font-medium">
                                Rejected
                              </span>
                            </>
                          )}
                        </div>
                      ) : isVerifiable && verificationCount > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            {verificationCount} Verification
                            {verificationCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <EnsName address={item.attester} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {timeAgo(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAttestation(item);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {selectedAttestation && (
        <AttestationSheet
          attestation={selectedAttestation}
          vaultId={id}
          onClose={() => setSelectedAttestation(null)}
        />
      )}
      {showCreateDialog && (
        <CreateAttestationDialog
          vaultId={id}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
      {showBatchVerify && (
        <BatchVerificationDialog
          vaultId={id}
          selectedIds={Array.from(selectedForVerification)}
          attestations={data?.items || []}
          onClose={() => {
            setShowBatchVerify(false);
            setSelectedForVerification(new Set());
          }}
        />
      )}
    </Card>
  );
}

function CreateAttestationDialog({
  vaultId,
  onClose,
}: {
  vaultId: Address;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: createAttestation, isPending } =
    useHypercertsCreateAttestation();
  const [resources, setResources] = useState<
    { title: string; src: string; mime: string }[]
  >([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    src: "",
    mime: "application/pdf",
  });

  const form = useForm<AttestationFormValues>({
    resolver: zodResolver(attestationFormSchema),
    defaultValues: {
      type: "milestone",
      title: "",
      description: "",
      image: "",
      geoJSON: "",
      visibility: "published",
      refUID: "",
      verified: true,
      resources: [],
    },
  });

  // Fetch attestations for this vault
  const { data: attestationsData } = useHypercertsAttestations({
    where: { recipient: vaultId },
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  const milestones =
    attestationsData?.items?.filter((item) => {
      const parsed = item.decodedParsed as any;
      return parsed?.type === "milestone";
    }) || [];

  const workClaims =
    attestationsData?.items?.filter((item) => {
      const parsed = item.decodedParsed as any;
      return parsed?.type === "work-claim";
    }) || [];

  const selectedType = form.watch("type");
  const isWorkClaim = selectedType === "work-claim";
  const isVerification = selectedType === "verification";

  const addResource = () => {
    if (newResource.title && newResource.src && newResource.mime) {
      setResources([...resources, newResource]);
      setNewResource({ title: "", src: "", mime: "application/pdf" });
      setShowResourceForm(false);
    }
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const onSubmit = (values: AttestationFormValues) => {
    const metadata: any = {
      title: values.title,
      description: values.description || undefined,
      image: values.image || undefined,
      geoJSON: values.geoJSON || undefined,
      resources: resources.length > 0 ? resources : undefined,
    };

    // Add verification-specific fields
    if (values.type === "verification") {
      metadata.verified = values.verified ?? true;
      metadata.verifier = "Current User";
      metadata.refAttestationId = values.refUID;
    }

    createAttestation(
      {
        recipient: vaultId,
        refUID: values.refUID || undefined,
        visibility: values.visibility,
        data: {
          type: values.type,
          metadata,
        },
      },
      {
        onSuccess: () => {
          toast.success("Attestation created successfully");
          queryClient.invalidateQueries({ queryKey: ["attestations"] });
          form.reset();
          setResources([]);
          onClose();
        },
        onError: (error) => {
          console.error("Error creating attestation:", error);
          toast.error("Failed to create attestation. Please try again.");
        },
      }
    );
  };

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:w-[700px] sm:max-w-[90vw] overflow-y-auto p-0">
        <div className="px-6 pt-6 pb-4 border-b bg-muted/20 sticky top-0 z-10">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle>Create Attestation</SheetTitle>
                <SheetDescription>
                  Create a new attestation for this vault
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-6 py-6"
          >
            {/* Attestation Type Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Attestation Type
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose the type of attestation you want to create
                </p>
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select attestation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="milestone">Milestone</SelectItem>
                        <SelectItem value="work-claim">Work Claim</SelectItem>
                        <SelectItem value="verification">
                          Verification
                        </SelectItem>
                        <SelectItem value="endorsement">Endorsement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Work Claim Reference Section */}
            {isWorkClaim && (
              <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Link to Milestone
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Optionally connect this work claim to a milestone
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="refUID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Milestone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a milestone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {milestones.length === 0 ? (
                            <SelectItem value="" disabled>
                              No milestones available
                            </SelectItem>
                          ) : (
                            milestones.map((milestone) => {
                              const parsed = milestone.decodedParsed as any;
                              const metadata =
                                typeof parsed.metadata === "string"
                                  ? JSON.parse(parsed.metadata)
                                  : parsed.metadata;
                              return (
                                <SelectItem
                                  key={milestone.id}
                                  value={milestone.id}
                                >
                                  {metadata?.title || "Untitled Milestone"}
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Link this work claim to a specific milestone
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Verification Section */}
            {isVerification && (
              <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Verification Details
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the work claim and verification result
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="refUID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Claim to Verify *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work claim to verify" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workClaims.length === 0 ? (
                            <SelectItem value="" disabled>
                              No work claims available to verify
                            </SelectItem>
                          ) : (
                            workClaims.map((claim) => {
                              const parsed = claim.decodedParsed as any;
                              const metadata =
                                typeof parsed.metadata === "string"
                                  ? JSON.parse(parsed.metadata)
                                  : parsed.metadata;
                              return (
                                <SelectItem key={claim.id} value={claim.id}>
                                  {metadata?.title || "Untitled Work Claim"}
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a work claim to verify or reject
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verified"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Result *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select verification result" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span>Verified (Approved)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="false">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>Rejected (Not Approved)</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Whether this work is verified or rejected
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Basic Information Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Basic Information
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Provide the core details for this attestation
                </p>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter attestation title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about this attestation..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Supports Markdown formatting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Media & Attachments Section */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Media & Attachments
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Add images, geographic data, and supporting documents
                </p>
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to an image associated with this attestation
                    </FormDescription>
                    {field.value && (
                      <div className="mt-2 rounded-lg overflow-hidden border">
                        <img
                          src={field.value}
                          alt="Preview"
                          className="w-full h-auto max-h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="geoJSON"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GeoJSON URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/geojson.json"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to a GeoJSON file for location-based attestations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resources / Supporting Documents */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">
                      Supporting Documents
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add evidence, reports, or other supporting materials
                    </p>
                  </div>
                  {!showResourceForm && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResourceForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Document
                    </Button>
                  )}
                </div>

                {/* Existing Resources List */}
                {resources.length > 0 && (
                  <div className="space-y-2">
                    {resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-background rounded-lg border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {resource.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {resource.src}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {resource.mime}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResource(index)}
                          className="ml-2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Resource Form */}
                {showResourceForm && (
                  <div className="space-y-3 p-4 bg-background rounded-lg border">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">
                        Document Title *
                      </label>
                      <Input
                        placeholder="E.g., Site Assessment Report"
                        value={newResource.title}
                        onChange={(e) =>
                          setNewResource({
                            ...newResource,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">
                        Document URL *
                      </label>
                      <Input
                        type="url"
                        placeholder="https://example.com/document.pdf"
                        value={newResource.src}
                        onChange={(e) =>
                          setNewResource({
                            ...newResource,
                            src: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">
                        Document Type *
                      </label>
                      <Select
                        value={newResource.mime}
                        onValueChange={(value) =>
                          setNewResource({ ...newResource, mime: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="application/pdf">
                            PDF Document
                          </SelectItem>
                          <SelectItem value="image/jpeg">JPEG Image</SelectItem>
                          <SelectItem value="image/png">PNG Image</SelectItem>
                          <SelectItem value="image/webp">WebP Image</SelectItem>
                          <SelectItem value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                            Excel Spreadsheet
                          </SelectItem>
                          <SelectItem value="text/csv">CSV File</SelectItem>
                          <SelectItem value="application/geo+json">
                            GeoJSON
                          </SelectItem>
                          <SelectItem value="text/html">HTML Page</SelectItem>
                          <SelectItem value="application/zip">
                            ZIP Archive
                          </SelectItem>
                          <SelectItem value="video/mp4">MP4 Video</SelectItem>
                          <SelectItem value="application/json">
                            JSON Data
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowResourceForm(false);
                          setNewResource({
                            title: "",
                            src: "",
                            mime: "application/pdf",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={addResource}
                        disabled={
                          !newResource.title ||
                          !newResource.src ||
                          !newResource.mime
                        }
                      >
                        Add Document
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visibility & Publishing Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Visibility & Publishing
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Control who can view this attestation
                </p>
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="organization">
                          Organization
                        </SelectItem>
                        <SelectItem value="draft">Public Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Private: Visible only to creator. Organization: Visible
                      within organizations. Draft: Public review before
                      publication. Published: Permanently published to EAS.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <div className="px-6 py-4 border-t bg-muted/20 sticky bottom-0">
          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              isLoading={isPending}
              loadingText="Creating..."
              className="flex-1 sm:flex-initial"
            >
              Create Attestation
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BatchVerificationDialog({
  vaultId,
  selectedIds,
  attestations,
  onClose,
}: {
  vaultId: Address;
  selectedIds: string[];
  attestations: any[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: createAttestation, isPending } =
    useHypercertsCreateAttestation();
  const { address } = useAccount();
  const [verificationComment, setVerificationComment] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ id: string; status: string }[]>([]);

  const selectedAttestations = attestations.filter((a) =>
    selectedIds.includes(a.id)
  );

  const handleVerifyAll = async (verified: boolean) => {
    const newResults: { id: string; status: string }[] = [];

    for (const attestation of selectedAttestations) {
      try {
        await new Promise<void>((resolve, reject) => {
          createAttestation(
            {
              refUID: attestation.id,
              recipient: vaultId,
              visibility: "published",
              data: {
                type: "verification",
                metadata: {
                  title: verified ? "Verified" : "Rejected",
                  description:
                    verificationComment ||
                    `Batch ${verified ? "verification" : "rejection"}`,
                  refAttestationId: attestation.id,
                  verified,
                },
              },
            },
            {
              onSuccess: () => {
                newResults.push({ id: attestation.id, status: "success" });
                resolve();
              },
              onError: (error) => {
                newResults.push({ id: attestation.id, status: "error" });
                reject(error);
              },
            }
          );
        });
        setCurrentIndex((i) => i + 1);
      } catch (error) {
        console.error("Error verifying attestation:", error);
      }
    }

    setResults(newResults);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["attestations"] });
      toast.success(
        `Batch verification complete: ${newResults.filter((r) => r.status === "success").length}/${selectedIds.length} successful`
      );
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Batch Verification</DialogTitle>
          <DialogDescription>
            Verify {selectedIds.length} selected item
            {selectedIds.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Verification Comment (Optional)
            </label>
            <Textarea
              placeholder="Add a comment for all verifications..."
              value={verificationComment}
              onChange={(e) => setVerificationComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="border rounded-lg p-4 bg-muted/30 max-h-[300px] overflow-y-auto">
            <h4 className="text-sm font-semibold mb-2">Selected Items:</h4>
            <div className="space-y-2">
              {selectedAttestations.map((attestation, idx) => {
                const parsed = attestation.decodedParsed as any;
                const metadata = JSON.parse(parsed.metadata);
                const result = results.find((r) => r.id === attestation.id);

                return (
                  <div
                    key={attestation.id}
                    className="flex items-center justify-between p-2 bg-background rounded border"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {metadata?.title || "Untitled"}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {parsed?.type}
                      </div>
                    </div>
                    {result && (
                      <div className="ml-2">
                        {result.status === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isPending && (
            <div className="text-sm text-muted-foreground">
              Processing: {currentIndex} / {selectedIds.length}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleVerifyAll(false)}
            disabled={isPending || !address}
          >
            Reject All
          </Button>
          <Button
            onClick={() => handleVerifyAll(true)}
            disabled={isPending || !address}
            isLoading={isPending}
            loadingText="Verifying..."
          >
            Verify All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const workClaimFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      {
        message: "Must be a valid URL",
      }
    ),
});

type WorkClaimFormValues = z.infer<typeof workClaimFormSchema>;

export function AttestationSheet({
  attestation,
  vaultId,
  onClose,
}: {
  attestation: any;
  vaultId: Address;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: createAttestation, isPending: isVerifying } =
    useHypercertsCreateAttestation();
  const { address } = useAccount();
  const [showWorkClaimForm, setShowWorkClaimForm] = useState(false);

  const parsed = attestation.decodedParsed as any;
  const isMilestone = parsed?.type === "milestone";
  const isWorkClaim = parsed?.type === "work-claim";
  const isVerification = parsed?.type === "verification";
  const isVerifiable = isWorkClaim; // Only work claims can be verified

  // Fetch work claims for this milestone
  const { data: attestationsData } = useHypercertsAttestations({
    where: { recipient: vaultId },
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  const workClaimsForMilestone =
    attestationsData?.items?.filter((item) => {
      const itemParsed = item.decodedParsed as any;
      return (
        itemParsed?.type === "work-claim" && item.refUID === attestation.id
      );
    }) || [];

  const workClaimForm = useForm<WorkClaimFormValues>({
    resolver: zodResolver(workClaimFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  // Parse metadata if it's a string
  let metadata: any = {};
  if (parsed?.metadata) {
    try {
      metadata =
        typeof parsed.metadata === "string"
          ? JSON.parse(parsed.metadata)
          : parsed.metadata;
    } catch (e) {
      metadata = parsed.metadata || {};
    }
  }

  const hasRefAttestation =
    attestation.refUID &&
    attestation.refUID !==
      "0x0000000000000000000000000000000000000000000000000000000000000000";

  const handleCreateWorkClaim = (values: WorkClaimFormValues) => {
    if (!address) {
      toast.error("Please connect your wallet to create work claims");
      return;
    }

    createAttestation(
      {
        refUID: attestation.id,
        recipient: vaultId,
        visibility: "published",
        data: {
          type: "work-claim",
          metadata: {
            title: values.title,
            description: values.description || undefined,
            image: values.image || undefined,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Work claim created successfully");
          queryClient.invalidateQueries({ queryKey: ["attestations"] });
          workClaimForm.reset();
          setShowWorkClaimForm(false);
        },
        onError: (error) => {
          console.error("Error creating work claim:", error);
          toast.error("Failed to create work claim. Please try again.");
        },
      }
    );
  };

  const handleVerify = (verified: boolean) => {
    if (!address) {
      toast.error("Please connect your wallet to verify attestations");
      return;
    }

    const itemTitle = metadata?.title || "work claim";

    createAttestation(
      {
        refUID: attestation.id,
        recipient: vaultId,
        visibility: "published",
        data: {
          type: "verification",
          metadata: {
            title: verified
              ? `✅ Verified: ${itemTitle}`
              : `⚠️ Rejected: ${itemTitle}`,
            description: `This work claim has been ${
              verified ? "verified" : "rejected"
            }`,
            refAttestationId: attestation.id,
            verified,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success(
            `Work claim ${verified ? "verified" : "rejected"} successfully`
          );
          queryClient.invalidateQueries({ queryKey: ["attestations"] });
          onClose();
        },
        onError: (error) => {
          console.error("Error verifying attestation:", error);
          toast.error("Failed to verify work claim. Please try again.");
        },
      }
    );
  };

  return (
    <Sheet open={!!attestation} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:w-[800px] sm:max-w-[90vw] overflow-y-auto p-0">
        <div className="px-6 pt-6 pb-4 border-b bg-muted/20">
          <SheetHeader>
            <div className="flex items-center gap-3">
              {isMilestone && <Award className="w-6 h-6 text-blue-500" />}
              {isVerification && (
                <ShieldCheck className="w-6 h-6 text-green-500" />
              )}
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl">
                  {metadata?.title || "Attestation Details"}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2 mt-1">
                  <span className="capitalize font-medium">{parsed?.type}</span>
                  {isVerification && metadata?.verified !== undefined && (
                    <>
                      <span>•</span>
                      <span
                        className={
                          metadata.verified ? "text-green-600" : "text-red-600"
                        }
                      >
                        {metadata.verified ? "Verified" : "Rejected"}
                      </span>
                    </>
                  )}
                  {isMilestone && metadata?.status && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{metadata.status}</span>
                    </>
                  )}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Image Display - Show first if available */}
          {metadata?.image && (
            <div className="rounded-lg overflow-hidden border shadow-sm max-w-2xl mx-auto">
              <img
                src={metadata.image}
                alt={metadata.title || "Attestation image"}
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {/* Main Content Card */}
          {metadata?.description && (
            <div className="bg-muted/50 rounded-lg p-4">
              <Markdown className="prose-sm max-w-none">
                {metadata.description}
              </Markdown>
            </div>
          )}

          {/* Milestone-specific Fields */}
          {isMilestone && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              {metadata?.status && (
                <div>
                  <label className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                    Status
                  </label>
                  <p className="text-sm font-medium mt-1 capitalize">
                    {metadata.status}
                  </p>
                </div>
              )}
              {metadata?.completedDate && (
                <div>
                  <label className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                    Completed Date
                  </label>
                  <p className="text-sm font-medium mt-1">
                    {new Date(metadata.completedDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Work Claim Creation Form for Milestones */}
          {isMilestone && (
            <div className="border-t pt-6 -mx-6 px-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Work Claims
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Register completed work for this milestone
                  </p>
                </div>
                {address && !showWorkClaimForm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWorkClaimForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Work Claim
                  </Button>
                )}
              </div>

              {/* List existing work claims */}
              {workClaimsForMilestone.length > 0 && (
                <div className="space-y-2 mb-4">
                  {workClaimsForMilestone.map((claim) => {
                    const claimParsed = claim.decodedParsed as any;
                    const claimMetadata =
                      typeof claimParsed.metadata === "string"
                        ? JSON.parse(claimParsed.metadata)
                        : claimParsed.metadata;

                    // Count verifications for this claim
                    const verificationCount =
                      attestationsData?.items?.filter((v) => {
                        const vParsed = v.decodedParsed as any;
                        return (
                          vParsed?.type === "verification" &&
                          v.refUID === claim.id
                        );
                      }).length || 0;

                    return (
                      <div
                        key={claim.id}
                        className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
                      >
                        <div className="flex items-start gap-3">
                          {claimMetadata?.image && (
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded overflow-hidden border-2 border-purple-200 dark:border-purple-700">
                                <img
                                  src={claimMetadata.image}
                                  alt={claimMetadata.title || "Work claim"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground">
                              {claimMetadata?.title || "Untitled Work Claim"}
                            </h4>
                            {claimMetadata?.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {claimMetadata.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{timeAgo(claim.createdAt)}</span>
                              {verificationCount > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-green-600" />
                                    {verificationCount} verification
                                    {verificationCount !== 1 ? "s" : ""}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {workClaimsForMilestone.length === 0 && !showWorkClaimForm && (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg border border-dashed">
                  No work claims yet. Add one to track completed work.
                </p>
              )}

              {showWorkClaimForm && address && (
                <Form {...workClaimForm}>
                  <form
                    onSubmit={workClaimForm.handleSubmit(handleCreateWorkClaim)}
                    className="space-y-4 p-4 bg-muted/30 rounded-lg border"
                  >
                    <FormField
                      control={workClaimForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g., Planted 100 trees in sector A"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={workClaimForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the completed work..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={workClaimForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://example.com/image.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Add an image to illustrate this work
                          </FormDescription>
                          {field.value && (
                            <div className="mt-2 rounded-lg overflow-hidden border">
                              <img
                                src={field.value}
                                alt="Preview"
                                className="w-full h-auto max-h-32 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          workClaimForm.reset();
                          setShowWorkClaimForm(false);
                        }}
                        disabled={isVerifying}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isVerifying}
                        isLoading={isVerifying}
                        loadingText="Creating..."
                      >
                        Create Work Claim
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          )}

          {/* Work Claim Badge */}
          {isWorkClaim && (
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <label className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                  Work Claim
                </label>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">
                This attestation represents completed work that can be verified
                by evaluators.
              </p>
            </div>
          )}

          {/* Verification-specific Fields */}
          {isVerification && (
            <div
              className={`grid grid-cols-2 gap-4 p-4 rounded-lg border ${
                metadata?.verified
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div>
                <label
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    metadata?.verified
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  Verification Status
                </label>
                <div className="flex items-center gap-2 mt-1">
                  {metadata?.verified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">
                        Rejected
                      </span>
                    </>
                  )}
                </div>
              </div>
              {metadata?.verifier && (
                <div>
                  <label
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      metadata?.verified
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    Verifier
                  </label>
                  <p className="text-sm font-medium mt-1">
                    {metadata.verifier}
                  </p>
                </div>
              )}
              {metadata?.verifierAddress && (
                <div className="col-span-2">
                  <label
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      metadata?.verified
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    Verifier Address
                  </label>
                  <p className="text-sm font-mono mt-1">
                    <EnsName address={metadata.verifierAddress as Address} />
                  </p>
                </div>
              )}
              {metadata?.refAttestationId && (
                <div className="col-span-2">
                  <label
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      metadata?.verified
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    References Attestation
                  </label>
                  <p className="text-xs font-mono mt-1 break-all">
                    {metadata.refAttestationId}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Supporting Evidence Resources */}
          {metadata?.resources && metadata.resources.length > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Supporting Evidence
              </label>
              <div className="mt-3 space-y-2">
                {metadata.resources.map((resource: any, idx: number) => (
                  <a
                    key={idx}
                    href={resource.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-background hover:bg-muted/50 rounded-md border transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      {resource.mime?.startsWith("image/") ? (
                        <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      ) : resource.mime === "application/pdf" ? (
                        <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                        {resource.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {resource.mime}
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* GeoJSON Link */}
          {metadata?.geoJSON && (
            <div className="p-4 bg-muted/30 rounded-lg border">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Geographic Data
              </label>
              <p className="text-sm mt-2">
                {typeof metadata.geoJSON === "string" ? (
                  <a
                    href={metadata.geoJSON}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View GeoJSON →
                  </a>
                ) : (
                  <span className="font-mono text-xs">
                    {JSON.stringify(metadata.geoJSON, null, 2)}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Technical Details */}
          <div className="border-t pt-6 space-y-4 -mx-6 px-6">
            <h3 className="text-sm font-semibold text-foreground">
              Technical Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Attester
                </label>
                <p className="mt-1 font-mono text-xs">
                  <EnsName address={attestation.attester} />
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Created
                </label>
                <p className="mt-1">
                  {new Date(Number(attestation.createdAt)).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {timeAgo(attestation.createdAt)}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Visibility
                </label>
                <p className="mt-1 capitalize">{parsed?.visibility || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  On-chain
                </label>
                <p className="mt-1">
                  {attestation.isOffchain ? "No (Off-chain)" : "Yes"}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Attestation ID
                </label>
                <p className="mt-1 font-mono text-xs break-all">
                  {attestation.id}
                </p>
              </div>
              {hasRefAttestation && (
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Reference UID
                  </label>
                  <p className="mt-1 font-mono text-xs break-all">
                    {attestation.refUID}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6 border-t bg-muted/20">
          <SheetFooter className="flex-col sm:flex-row gap-2">
            {isVerifiable && address && (
              <>
                <Button
                  onClick={() => handleVerify(false)}
                  disabled={isVerifying}
                  variant="destructive"
                  className="flex-1 sm:flex-initial"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleVerify(true)}
                  disabled={isVerifying}
                  isLoading={isVerifying}
                  loadingText="Verifying..."
                  className="flex-1 sm:flex-initial"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verify
                </Button>
              </>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
