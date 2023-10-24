import { type NextPage } from "next";

import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";
import AccountCard from "@/components/account/account-card";
import SkeletonAccountCard from "@/components/account/skeleton-account-card";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { current_account_id } = useAccountStore();

  const { isLoading, data: account } = api.account.getAccountDetail.useQuery(
    {
      account_id: current_account_id!,
    },
    {
      enabled: current_account_id !== null,
    },
  );

  useEffect( () => {
    document.title = "Dashboard | Onyx Salamaner Bank"
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | Onyx Salamaner Bank</title>
        <meta name="description" content="Hack Weekly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {account == undefined ? (
            <SkeletonAccountCard />
          ) : (
            <AccountCard balance={Number(account.balance).toFixed(2)} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
