import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "@/lib/api";

import "../styles/globals.css";
import { useAccountStore } from "@/lib/store";
import { useEffect } from "react";
import Layout from "@/components/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  const accounts = api.account.list.useQuery();
  const changeAccount = useAccountStore((state) => state.changeAccount);
  const current_account_id = useAccountStore(
    (state) => state.current_account_id
  );

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
    }
  }, [current_account_id, accounts, changeAccount]);

  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
