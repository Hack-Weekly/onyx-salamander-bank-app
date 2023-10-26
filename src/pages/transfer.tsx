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
import { useAccountStore } from "@/lib/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import Spinner from "@/components/ui/spinner";

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
  const { current_account_id } = useAccountStore();
  const mutation = api.account.transferMoney.useMutation();
  const { data: transactions, isLoading } =
    api.transaction.getTransactionsHistory.useQuery({
      account_id: current_account_id!,
    });
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
        transfer_from: current_account_id!,
        ...values,
      })
      .then(() => {
        const { amount, transfer_to } = values;
        toast(`Successfully transferred ${amount} to ${transfer_to}`);
        utils.account.getAccountDetail.fetch({
          account_id: current_account_id!,
        });
      });
  };

  const formatDate = (date: Date) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get the day, month, and year
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Get the hour, minute, and second
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-center items-center space-y-2">
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
        <Spinner 
          text="Loading transactions..."/>
      ) : transactions.length === 0 ? (
        "No transactions"
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={
                  transaction.timestamp.toString() +
                  transaction.to.account_id +
                  transaction.from.account_id
                }
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    Image
                    <div>
                      <p>{transaction.from.user.username}</p>
                      <p className="opacity-70 mt-1">
                        {transaction.from.account_id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {" "}
                  <div className="flex items-center gap-2">
                    Image
                    <div>
                      <p>{transaction.to.user.username}</p>
                      <p className="opacity-70 mt-1">
                        {transaction.to.account_id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p>{formatDate(transaction.timestamp)}</p>
                  <p className="opacity-70 mt-1">
                    Status: {transaction.status.toLocaleUpperCase()}
                  </p>
                </TableCell>
                <TableCell
                  className={clsx(
                    "text-right",
                    transaction.from.account_id === current_account_id &&
                      "text-red-600 font-medium",
                    transaction.to.account_id === current_account_id &&
                      "text-green-600 font-medium",
                  )}
                >
                  {transaction.from.account_id === current_account_id && "-"}
                  {transaction.to.account_id === current_account_id && "+"}$
                  {Number(transaction.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
