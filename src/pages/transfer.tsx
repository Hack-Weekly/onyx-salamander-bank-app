import TransferSelector from "@/components/transfer/transfer-selector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import { Separator } from "@/components/ui/separator";

const formSchema = z
  .object({
    transfer_to: z.string().min(1, {
      message: "Please indicate bank account to transfer to.",
    }),
    amount: z.string().refine(
      (value) => {
        return /^\d*\.?\d+$/.test(value) && parseFloat(value) > 0;
      },
      { message: "Plase enter a positive number." },
    ),
  })
  .required();

export default function Transfer() {
  const mutation = api.account.transferMoney.useMutation();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transfer_to: "",
      amount: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    return mutation
      .mutateAsync({
        ...values,
      })
      .then(() => {
        const { amount, transfer_to } = values;
        toast(`Successfully transferred ${amount} to ${transfer_to}`);
        utils.account.getAccountDetail.fetch();
      });
  };

  return (
    <>
      <Head>
        <title>Transfer | Onyx Salamaner Bank</title>
      </Head>
      <h2 className="text-3xl font-bold tracking-tight">Transfer</h2>
      <p className="text-muted-foreground">Send money between accounts.</p>
      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="transfer_to"
              render={({ field: { onChange, value } }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transfer to</FormLabel>
                  <FormControl>
                    <TransferSelector account_id={value} onChange={onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-6 w-6 animate-spin" />
                Transferring
              </span>
            ) : (
              "Transfer now"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
