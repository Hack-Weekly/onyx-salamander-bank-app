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
import { CalendarIcon, Loader2 } from "lucide-react";
import Head from "next/head";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateBefore } from "react-day-picker";

export default function Transfer() {
  const mutation = api.account.transferMoney.useMutation();
  const utils = api.useUtils();
  const { data: details, isLoading } = api.account.getAccountDetail.useQuery();
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [date, setDate] = useState<Date>();
  const currentDate = new Date();

  const disabledDays: DateBefore = { before: currentDate };

  const formSchema = z
    .object({
      transfer_to: z.string().min(1, {
        message: "Please indicate the bank account to transfer to.",
      }),
      amount: z
        .string()
        .refine(
          (value) => {
            return /^\d*\.?\d+$/.test(value) && Number(value) > 0;
          },
          { message: "Plase enter a positive number." },
        )
        .refine(
          (value) => {
            return Number(value) <= Number(details?.balance);
          },
          {
            message: `Please don't try to transfer more than you have.`,
          },
        )
        .refine(
          (value) => {
            return Number(value) <= Number(details?.transfer_limit);
          },
          {
            message: `Amount could not be higher than the transfer limit of ${details?.transfer_limit}.`,
          },
        ),
      date: z
        .date({
          required_error: "Please select a date and time",
          invalid_type_error: "That's not a date!",
        })
        .min(currentDate, {
          message: "Please select a valid date and time.",
        }),
    })
    .required();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transfer_to: "",
      amount: "",
      date: currentDate,
    },
  });

  const transfer = async (values: z.infer<typeof formSchema>) => {
    return mutation
      .mutateAsync({
        ...values,
      })
      .then(() => {
        const { amount, transfer_to } = values;
        toast.success(
          `Successfully transferred $${Number(amount).toFixed(
            2,
          )} to acocunt ${transfer_to}.`,
        );
        form.reset();
        utils.account.getAccountDetail.invalidate();
        utils.transaction.getTransactionsHistory.invalidate();
      })
      .catch(() => {
        toast.error(`Transfer amount is larger than account's transfer limit`);
      });
  };

  const scheduleTransfer = async (values: z.infer<typeof formSchema>) => {
    const schedule = require("node-schedule");
    const job = schedule.scheduleJob(
      values.date,
      function (values: z.infer<typeof formSchema>) {
        transfer(values);
      }.bind(null, values),
    );
    toast.success(`Transfer scheduled on ${format(values.date, "PPP")}.`);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.date != currentDate) return await scheduleTransfer(values);
    return await transfer(values);
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
          {isLoading ? (
            <>
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-2 h-10 w-36" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-2 h-10 w-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </>
          ) : (
            <>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="transfer_to"
                  render={({ field: { onChange, value } }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Transfer to</FormLabel>
                      <FormControl>
                        <TransferSelector
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
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter an amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-x-5">
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

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          Transferring
                        </span>
                      ) : (
                        "Transfer later"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select the transfer date</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <Popover
                        open={openCalendar}
                        onOpenChange={setOpenCalendar}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field: { onChange, value } }) => (
                              <FormItem className="flex flex-col">
                                <FormControl>
                                  <Calendar
                                    mode="single"
                                    selected={value}
                                    onSelect={(e) => {
                                      onChange(e);
                                      setDate(e);
                                      setOpenCalendar(false);
                                    }}
                                    disabled={disabledDays}
                                    initialFocus
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </PopoverContent>
                      </Popover>
                    </DialogDescription>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="destructive">Close</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          onClick={(e) => {
                            form.handleSubmit(onSubmit)(e);
                            setOpenDialog(false);
                          }}
                        >
                          Confirm
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </form>
      </Form>
    </>
  );
}
