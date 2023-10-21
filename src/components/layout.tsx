import { MainNav } from "@/components/main-nav";
import { useAccountStore } from "@/lib/store";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  const [hasAccount, setHasAccount] = useState(true);
  const current_account_id = useAccountStore(
    (state) => state.current_account_id
  );

  useEffect(() => {
    setHasAccount(current_account_id !== null);
  }, [current_account_id]);

  return (
    <main className={inter.className}>
      <SignedIn>
        {hasAccount ? (
          <>
            <div className="flex h-16 items-center px-4 border-b">
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
            {children}
          </>
        ) : (
          <>
            <div>Create Account</div>
            <UserButton afterSignOutUrl="/"/>
          </>
        )}
      </SignedIn>
      <SignedOut>{children}</SignedOut>
    </main>
  );
}
