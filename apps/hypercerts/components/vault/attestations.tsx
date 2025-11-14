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

type Visibility = "private" | "organization" | "draft" | "published";

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
});

type AttestationFormValues = z.infer<typeof attestationFormSchema>;

export function Attestations({ id }: { id: Address }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAttestation, setSelectedAttestation] = useState<any | null>(
    null
  );

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
  console.log(1212312, data);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Attestations</CardTitle>
          <Button onClick={() => setShowCreateDialog(true)} disabled={!id}>
            <Plus className="w-4 h-4 mr-2" />
            Create Attestation
          </Button>
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

                return (
                  <TableRow
                    key={i}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedAttestation(item)}
                  >
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
                      <p className="text-sm text-muted-foreground truncate">
                        {metadata?.description || "—"}
                      </p>
                    </TableCell>
                    <TableCell>
                      {isVerification && (
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
                      )}
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
        <AttestationDialog
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

  const form = useForm<AttestationFormValues>({
    resolver: zodResolver(attestationFormSchema),
    defaultValues: {
      type: "milestone",
      title: "",
      description: "",
      image: "",
      geoJSON: "",
      visibility: "published",
    },
  });

  const onSubmit = (values: AttestationFormValues) => {
    createAttestation(
      {
        recipient: vaultId,
        visibility: values.visibility,
        data: {
          type: values.type,
          metadata: {
            title: values.title,
            description: values.description || undefined,
            image: values.image || undefined,
            geoJSON: values.geoJSON || undefined,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Attestation created successfully");
          queryClient.invalidateQueries({ queryKey: ["attestations"] });
          form.reset();
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
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Attestation</DialogTitle>
          <DialogDescription>
            Create a new attestation for this vault
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
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
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="endorsement">Endorsement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of attestation you want to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Attestation title" {...field} />
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
                      placeholder="Attestation description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
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
                      <SelectItem value="organization">Organization</SelectItem>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isPending}
                loadingText="Creating..."
              >
                Create Attestation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AttestationDialog({
  attestation,
  vaultId,
  onClose,
}: {
  attestation: any;
  vaultId: Address;
  onClose: () => void;
}) {
  const { mutate: createAttestation, isPending: isVerifying } =
    useHypercertsCreateAttestation();
  const { address } = useAccount();
  const parsed = attestation.decodedParsed as any;
  const isMilestone = parsed?.type === "milestone";
  const isVerification = parsed?.type === "verification";

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

  const handleVerify = (verified: boolean) => {
    if (!address) {
      toast.error("Please connect your wallet to verify attestations");
      return;
    }

    createAttestation(
      {
        refUID: attestation.id,
        recipient: vaultId,
        visibility: "published",
        data: {
          type: "verification",
          metadata: {
            title: verified ? "Verified Milestone" : "Rejected Milestone",
            description: `This milestone attestation has been ${
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
            `Milestone ${verified ? "verified" : "rejected"} successfully`
          );
          onClose();
        },
        onError: (error) => {
          console.error("Error verifying attestation:", error);
          toast.error("Failed to verify milestone. Please try again.");
        },
      }
    );
  };

  return (
    <Dialog open={!!attestation} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isMilestone && <Award className="w-6 h-6 text-blue-500" />}
            {isVerification && (
              <ShieldCheck className="w-6 h-6 text-green-500" />
            )}
            <div>
              <DialogTitle className="text-xl">
                {metadata?.title || "Attestation Details"}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
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
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Content Card */}
          {metadata?.description && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {metadata.description}
              </p>
            </div>
          )}

          {/* Image Display */}
          {metadata?.image && (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={metadata.image}
                alt={metadata.title || "Attestation image"}
                className="w-full h-auto"
              />
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
          <div className="border-t pt-6 space-y-4">
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

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isMilestone && address && (
            <Button
              onClick={() => handleVerify(true)}
              disabled={isVerifying}
              isLoading={isVerifying}
              loadingText="Verifying..."
              className="flex-1 sm:flex-initial"
              icon={CheckCircle2}
            >
              Verify Milestone
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
