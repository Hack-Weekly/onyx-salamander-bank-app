import { MainNav } from "@/components/main-nav";
import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import Spinner from "@/components/ui/spinner";
import CreateAccount from "@/components/account/create-account";
import AccountSwitcher from "./account/account-switcher";
import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: accounts, isLoading } = api.account.list.useQuery();

  const { changeAccount, current_account_id } = useAccountStore();

  useEffect(() => {
    // Check if the 'account' is null and if there is data in 'accounts.data'
    if (!isLoading) {
      if (current_account_id === null && accounts && accounts.length > 0) {
        // Set the first account from the 'accounts.data' list
        // TODO: Maybe have option to set as default account
        fetch("/api/cookie", {
          method: "POST",
          body: JSON.stringify({
            name: "current_account_id",
            value: accounts[0].account_id,
          }),
        }).then(() => {
          changeAccount(accounts[0].account_id);
        });
      } else if (accounts?.length === 0) {
        changeAccount(null);
      }
    }
  }, [current_account_id, accounts, changeAccount, isLoading]);

  return (
    <>
      <Head>
        <meta name="description" content="Hack Weekly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-16 items-center border-b px-4">
        <AccountSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/sign-out" />
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8">
        {accounts ? (
          current_account_id ? (
            children
          ) : (
            <CreateAccount />
          )
        ) : (
          <Spinner text="Loading accounts..." />
        )}
      </div>
    </>
  );
}
