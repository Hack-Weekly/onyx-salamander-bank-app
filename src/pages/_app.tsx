import "../styles/globals.css";
import { type AppType } from "next/app";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { Toaster } from "sonner";
import Layout from "@/components/layout";
import { Inter } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <main className={inter.className}>
        <SignedIn>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SignedIn>
        <SignedOut>
          <Component {...pageProps} />
        </SignedOut>
      </main>
      <Toaster richColors />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
