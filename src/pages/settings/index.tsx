import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { inferRouterInputs } from "@trpc/server";
import { z } from "zod";
import { AppRouter } from "@/server/api/root";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAccountStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  type SettingsFormValues = Omit<
    inferRouterInputs<AppRouter>["account"]["setPreferences"],
    "account_id"
  >;

  const { current_account_id } = useAccountStore();

  const { data: preferences, isLoading } = api.account.getPreferences.useQuery(
    {
      account_id: current_account_id!,
    },
    {
      enabled: current_account_id !== null,
    },
  );
  const setPreferences = api.account.setPreferences.useMutation();
  const utils = api.useUtils();

  const SettingsFormSchema = z.object({
    transfer_limit: z.string().refine(
      (value) => {
        return /^\d*\.?\d+$/.test(value) && parseFloat(value) > 0;
      },
      { message: "Plase enter a positive number." },
    ),
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      transfer_limit: "0",
    },
    mode: "onChange",
  });

  const onSubmit = (data: SettingsFormValues) => {
    setPreferences
      .mutateAsync({
        transfer_limit: data.transfer_limit,
        account_id: current_account_id!,
      })
      .then(() => {
        toast("Successfully set preferences.");
        utils.account.getPreferences.invalidate();
      });
  };

  useEffect(() => {
    if (preferences) {
      form.reset({ transfer_limit: preferences.transfer_limit });
    }
  }, [preferences]);

  return (
    <>
      <Head>
        <title>Settings | Onyx Salamaner Bank</title>
        <meta name="description" content="Hack Weekly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground">Manage your account settings.</p>
      <Separator className="my-6" />
      <div className="flex-1 lg:max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {isLoading ? (
              <>
                <div>
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full mt-2" />
                </div>
                <Skeleton className="h-10 w-36" />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="transfer_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transfer Limit</FormLabel>
                      <FormControl>
                        <Input placeholder="2000" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is how much you can transfer to other accounts.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Update Account</Button>
              </>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}
