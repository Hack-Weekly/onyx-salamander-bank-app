import { type NextPage } from "next";

import AccountBalanceCard from "@/components/account/account-balance-card";
import Head from "next/head";
import TransactionTable from "@/components/transaction/transaction-table";
import { Separator } from "@/components/ui/separator";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | Onyx Salamaner Bank</title>
      </Head>

      <div className="flex-1 space-y-4 pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AccountBalanceCard />
        </div>
      </div>
      <div className="flex-1 space-y-4 ">
        <h3 className="text-2xl font-bold tracking-tight">Transactions</h3>
        <Separator />
        <TransactionTable />
      </div>
    </>
  );
};

export default Home;
