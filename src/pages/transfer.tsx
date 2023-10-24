import TransferSelector from "@/components/transfer/transfer-selector";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  transfer_to: z.string(),
  amount: z.string()
})
.required();

export default function Transfer() {
  const mutation = api.account.transferMoney.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutation.mutateAsync({
      transfer_to: values.transfer_to,
      amount: values.amount
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={ form.handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center items-center h-96 space-y-2">
          
          <FormField
            control={form.control}
            name="transfer_to"
            render={({ field: { onChange, value} }) => (
              <FormItem>
                <FormControl>
                  <TransferSelector 
                    type="To"
                    account_id={ value }
                    onChange={ onChange } />
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

          <Button type="submit">Transfer now</Button>
        </div>
      </form>
    </Form>
  );
}
