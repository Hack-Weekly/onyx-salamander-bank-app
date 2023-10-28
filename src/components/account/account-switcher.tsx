import { PopoverTrigger } from "@radix-ui/react-popover";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAccountStore } from "@/lib/store";
import { Popover, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "../ui/command";
import clsx from "clsx";
import { api } from "@/lib/api";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import CreateAccountButton from "./create-account-button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface AccountSwitcherProps extends PopoverTriggerProps {}

export default function AccountSwitcher({ className }: AccountSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [loadingCookie, setLoadingCookie] = React.useState(false);
  const { current_account_id, changeAccount } = useAccountStore();
  const [previousAccountId, setPreviousAccountId] =
    React.useState(current_account_id);
  const { data: accounts } = api.account.list.useQuery();
  const utils = api.useUtils();

  const onChangeAccount = (account_id: string) => {
    if (current_account_id !== account_id) {
      setLoadingCookie(true);
      setPreviousAccountId(current_account_id);
      changeAccount(account_id);

      fetch("/api/cookie", {
        method: "POST",
        body: JSON.stringify({
          name: "current_account_id",
          value: account_id,
        }),
      })
        .then(() => {
          setLoadingCookie(false);
          setOpen(false);
          utils.account.getAccountDetail.reset();
          utils.account.getPreferences.reset();
          utils.transaction.getTransactionsHistory.reset();
        })
        .catch(() => {
          changeAccount(previousAccountId);
          toast.error("Something went wrong while switching account.");
        });
    } else {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("w-[200px] justify-between", className)}
          disabled={!current_account_id}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage
              src={`https://avatar.vercel.sh/${current_account_id}.png`}
              alt={current_account_id ?? "Not selected"}
              className={clsx(current_account_id === null && "grayscale")}
            />
            <AvatarFallback>
              <span className="h-full w-full grayscale"></span>
            </AvatarFallback>
          </Avatar>
          <span className="inline-block w-full overflow-hidden overflow-ellipsis">
            {current_account_id}
          </span>
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search account..." />
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup heading="Account">
              {accounts?.map((account) => (
                <CommandItem
                  key={account.account_id}
                  onSelect={() => onChangeAccount(account.account_id)}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${account.account_id}.png`}
                      alt={`Account number: account.account_id`}
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {account.account_id}
                  {loadingCookie ? (
                    <Loader2
                      className={cn(
                        "ml-auto h-4 w-4 animate-spin",
                        current_account_id === account.account_id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  ) : (
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        current_account_id === account.account_id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                <CreateAccountButton
                  variant={"ghost"}
                  className="h-0 cursor-default px-0 text-sm font-normal"
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
