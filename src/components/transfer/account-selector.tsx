import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";

export default function AccountSelector() {
    const { current_account_id, hasAccount, changeAccount } = useAccountStore();
    const { data: accounts } = api.account.list.useQuery();

    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {
                        accounts!.map( account => {
                            return <SelectItem value={ account.account_id }>{ account.account_id }</SelectItem>
                        })
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}