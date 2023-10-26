import { PopoverTrigger } from "@radix-ui/react-popover";
import React from "react";
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

export default function TransferSelector({
  type,
  account_id,
  onChange,
}: {
  type: string;
  account_id: string;
  onChange: (account_id: string) => void;
}) {
  const { current_account_id } = useAccountStore();
  const [open, setOpen] = React.useState(false);
  const { data: accounts } = api.account.allAccounts.useQuery();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="To account"
          className="w-max justify-between"
        >
          <span className="inline-block w-full overflow-hidden overflow-ellipsis">
            {account_id == "" ? `${type} account` : account_id}
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
              {accounts?.map((account) =>
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
