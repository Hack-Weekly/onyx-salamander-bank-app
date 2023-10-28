import { PopoverTrigger } from "@radix-ui/react-popover";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { api } from "@/lib/api";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useAccountStore } from "@/lib/store";
import { useUser } from "@clerk/nextjs";

export default function TransferSelector({
  account_id,
  onChange,
}: {
  account_id: string;
  onChange: (account_id: string) => void;
}) {
  const { user } = useUser();
  const { current_account_id } = useAccountStore();
  const [open, setOpen] = React.useState(false);
  const { data: accounts } = api.account.allAccounts.useQuery();
  const current_user_accounts = accounts
    ? accounts.filter((account) => account.user_id === user?.id)
    : [];
  const other_accounts = accounts
    ? accounts.filter((account) => account.user_id !== user?.id)
    : [];

  useEffect(() => {
    if (account_id === current_account_id) {
      onChange("");
    }
  }, [account_id, current_account_id]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select account"
          className="w-max justify-between"
        >
          <span className="inline-block w-full overflow-hidden overflow-ellipsis">
            {account_id == "" ? `Select account` : account_id}
          </span>
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search account..." />
            <CommandEmpty>No account found.</CommandEmpty>
            {current_user_accounts.length > 0 && (
              <CommandGroup heading="Your Accounts">
                {current_user_accounts.map((account) =>
                  account.account_id == current_account_id ? null : (
                    <CommandItem
                      key={account.account_id}
                      onSelect={(id) => {
                        setOpen(false);
                        onChange(id);
                      }}
                      className="text-sm"
                    >
                      {account.account_id}
                    </CommandItem>
                  ),
                )}
              </CommandGroup>
            )}
            <CommandGroup heading="Account">
              {other_accounts?.map((account) =>
                account.account_id == current_account_id ? null : (
                  <CommandItem
                    key={account.account_id}
                    onSelect={(id) => {
                      setOpen(false);
                      onChange(id);
                    }}
                    className="text-sm"
                  >
                    {account.account_id}
                  </CommandItem>
                ),
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
