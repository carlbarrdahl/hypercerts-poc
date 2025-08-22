"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { LoginButton } from "@/components/login-button";
import { Input } from "@workspace/ui/components/input";
import { Form, FormField } from "@workspace/ui/components/form";
import { useForm } from "react-hook-form";
import { orpc } from "@/lib/orpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export default function Page() {
  return (
    <div className="">
      <ListOrganizations />
    </div>
  );
}



function ListOrganizations() {
  const { authenticated } = usePrivy();
  const { data, isPending } = useQuery(
    orpc.organization.list.queryOptions({
      enabled: authenticated,
    })
  );
  if (isPending)
    return (
      <div className="flex items-center justify-center h-48 border rounded w-full">
        Loading organizations...
      </div>
    );

  if (!data?.length)
    return (
      <div className="flex items-center justify-center h-48 border rounded w-full">
        No organizations found
        <CreateOrganization />
      </div>
    );

  return (
    <div>
      <h3>Organizations</h3>
      <div>
        {data?.map((org) => (
          <div key={org.id} className="border rounded p-2">
            <Link href={`/org/${org.id}`}>
            <div>

            {org.id}
            </div>
            <div className="text-xs">
              Owner: {org.ownerId}
            </div>
            <pre>{JSON.stringify(org, null, 2)}</pre>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateOrganization() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    orpc.organization.create.mutationOptions({
      onSuccess() {
        toast.success("Organization created successfully");
        queryClient.invalidateQueries(orpc.organization.list.queryOptions());
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );

  return (
    <div>
      <Button
        onClick={() => {
          mutate({});
        }}
      >
        Create Organization
      </Button>
    </div>
  );
}

function UpdateOrganization({
  defaultValues,
}: {
  defaultValues: { id: string; name?: string; description?: string };
}) {
  const form = useForm({
    defaultValues: {
      id: "",
      name: defaultValues.name ?? "",
      description: defaultValues.description ?? "",
    },
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    orpc.organization.update.mutationOptions({
      onSuccess() {
        toast.success("Organization created successfully");
        queryClient.invalidateQueries(orpc.organization.list.queryOptions());
      },
      onError(error) {
        toast.error(error.message);
      },
    })
  );

  return (
    <div>
      <h3>Update Organization</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            console.log(values);

            mutate({ ...values, id: defaultValues.id });
          })}
        >
          {defaultValues.id && <Input type="hidden" value={defaultValues.id} />}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <Input placeholder="Organization Name" {...field} />
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <Input placeholder="Organization Description" {...field} />
            )}
          />
          <Button type="submit">Update</Button>
        </form>
      </Form>
    </div>
  );
}
