import { useAccountStore } from "@/lib/store";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const { clearAccount } = useAccountStore();
  const router = useRouter();

  useEffect(() => {
    clearAccount();
    router.replace("/");
  }, [clearAccount, router]);

  return <div>Loading</div>;
}
