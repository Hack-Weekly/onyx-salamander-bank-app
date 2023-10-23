import { MainNav } from "@/components/main-nav";
import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import CreateAccount from "./create-account/create-account";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [hasAccount, setHasAccount] = useState(true);
  const accounts = api.account.list.useQuery();

  const current_account_id = useAccountStore(
    (state) => state.current_account_id
  );
  const changeAccount = useAccountStore((state) => state.changeAccount);

  useEffect(() => {
    // Check if the 'account' is null and if there is data in 'accounts.data'
    if (
      current_account_id === null &&
      accounts.data &&
      accounts.data.length > 0
    ) {
      // Set the first account from the 'accounts.data' list
      // TODO: Maybe have option to set as default account
      changeAccount(accounts.data[0].account_id);
    } else {
      setHasAccount(current_account_id !== null);
    }
  }, [current_account_id, accounts, changeAccount]);

  return hasAccount ? (
    <>
      <div className="flex h-16 items-center px-4 border-b">
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      {current_account_id ? children : "Loading"}
    </>
  ) : (
    <CreateAccount/>
  );
}
