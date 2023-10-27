import { type NextPage } from "next";

import { api } from "@/lib/api";
import AccountCard from "@/components/account/account-card";
import SkeletonAccountCard from "@/components/account/skeleton-account-card";
import Head from "next/head";
import Spinner from "@/components/ui/spinner";
import TransactionTable from "@/components/transaction/transaction-table";
import { Separator } from "@/components/ui/separator";

const Home: NextPage = () => {
  const { data: account } = api.account.getAccountDetail.useQuery();
  const { data: transactions, isLoading: transactionIsLoading } =
    api.transaction.getTransactionsHistory.useQuery();

  return (
    <>
      <Head>
        <title>Dashboard | Onyx Salamaner Bank</title>
      </Head>

      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {account == undefined ? (
            <SkeletonAccountCard />
          ) : (
            <AccountCard balance={Number(account.balance).toFixed(2)} />
          )}
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h3 className="text-2xl font-bold tracking-tight">Transactions</h3>
        <Separator />
        {!transactions || transactionIsLoading ? (
          <Spinner text="Loading transactions..." />
        ) : transactions.length === 0 ? (
          "No transactions"
        ) : (
          <TransactionTable data={transactions} />
        )}
      </div>
    </>
  );
};

export default Home;
