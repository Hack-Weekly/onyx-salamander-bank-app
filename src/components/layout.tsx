import { MainNav } from "@/components/main-nav";
import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import CreateAccount from "./account/create-account";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [hasAccount, setHasAccount] = useState(true);
  const { data: accounts, isLoading } = api.account.list.useQuery();

  const { changeAccount, current_account_id } = useAccountStore();

  useEffect(() => {
    // Check if the 'account' is null and if there is data in 'accounts.data'
    if (!isLoading) {
      if (current_account_id === null && accounts && accounts.length > 0) {
        // Set the first account from the 'accounts.data' list
        // TODO: Maybe have option to set as default account
        changeAccount(accounts[0].account_id);
        setHasAccount(true);
      } else if (current_account_id !== null && accounts?.length === 0) {
        changeAccount(null);
        setHasAccount(false);
      }
    }
  }, [current_account_id, accounts, changeAccount, isLoading]);

  return (
    <>
      <div className="flex h-16 items-center px-4 border-b">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/sign-out" />
        </div>
      </div>
      {hasAccount ? (
        current_account_id ? (
          children
        ) : (
          "Loading"
        )
      ) : (
        <CreateAccount />
      )}
    </>
  );
}
