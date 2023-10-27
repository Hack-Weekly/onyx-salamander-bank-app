import TransferSelector from "@/components/transfer/transfer-selector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import TransactionTable from "@/components/transaction/transaction-table";

const formSchema = z
  .object({
    transfer_to: z.string().min(1, {
      message: "Indicate bank account to transfer to.",
    }),
    amount: z.string().min(1, {
      message: "Indicate amount to transfer.",
    }),
  })
  .required();

export default function Transfer() {
  const mutation = api.account.transferMoney.useMutation();
  const { data: transactions, isLoading } =
    api.transaction.getTransactionsHistory.useQuery();
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center space-y-2">
            <FormField
              control={form.control}
              name="transfer_to"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormControl>
                    <TransferSelector
                      type="To"
                      account_id={value}
                      onChange={onChange}
                    />
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
                  <FormControl>
                    <Input placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Transfer now"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {!transactions || isLoading ? (
        <Spinner text="Loading transactions..." />
      ) : transactions.length === 0 ? (
        "No transactions"
      ) : (
        <TransactionTable data={transactions} />
      )}
    </>
  );
}
