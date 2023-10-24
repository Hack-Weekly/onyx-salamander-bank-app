import TransferSelector from "@/components/transfer/transfer-selector";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input";
import { useAccountStore } from "@/lib/store";

const formSchema = z.object({
  transfer_to: z.string().min(1, {
    message: "Indicate bank account to transfer to."
  }),
  amount: z.string().min(1, {
    message: "Indicate amount to transfer."
  })
})
.required();

export default function Transfer() {
  const { current_account_id } = useAccountStore();
  const mutation = api.account.transferMoney.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transfer_to: "",
      amount: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(Number(values.amount))
    const res = await mutation.mutateAsync({
      transfer_from: current_account_id!,
      ...values
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={ form.handleSubmit(onSubmit) }>
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
