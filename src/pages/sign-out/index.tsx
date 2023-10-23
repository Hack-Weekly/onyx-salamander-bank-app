import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function SignOut() {
  const { clearStore } = useAccountStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  queryClient.resetQueries();

  useEffect(() => {
    clearStore();
    router.replace("/");
  }, []);

  return <></>;
}
