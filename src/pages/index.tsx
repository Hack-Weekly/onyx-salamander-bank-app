import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAccountStore } from "@/lib/store";

const Home: NextPage = () => {
  const current_account_id = useAccountStore(
    (state) => state.current_account_id
  );
  const { isLoading, data: account } = api.account.getAccountDetail.useQuery(
    {
      account_id: current_account_id!,
    },
    {
      enabled: current_account_id !== null,
    }
  );

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
          {isLoading ? (
            "Loading..."
          ) : account ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${Number(account.balance).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    show growth from last month?
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            "No account"
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
