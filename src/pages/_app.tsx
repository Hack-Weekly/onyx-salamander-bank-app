import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "@/lib/api";

import "../styles/globals.css";
import Layout from "@/components/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
