import { type NextPage } from "next";

import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";
import AccountCard from "@/components/account/account-card";
import SkeletonAccountCard from "@/components/account/skeleton-account-card";
import Head from "next/head";
import Spinner from "@/components/ui/spinner";
import TransactionTable from "@/components/transaction/transaction-table";

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
  const { data: transactions, isLoading: transactionIsLoading } =
    api.transaction.getTransactionsHistory.useQuery({
      account_id: current_account_id!,
    });

  return (
    <>
      <Head>
        <title>Dashboard | Onyx Salamaner Bank</title>
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
        <h3 className="text-2xl font-bold tracking-tight">Transactions</h3>
        {!transactions || transactionIsLoading ? (
          <Spinner 
            text="Loading transactions..."/>
        ) : transactions.length === 0 ? (
          "No transactions"
        ) : (
          <TransactionTable 
            data={ transactions }/>
        )}
      </div>
    </>
  );
};

export default Home;
