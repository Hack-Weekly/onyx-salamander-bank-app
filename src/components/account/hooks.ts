import { api } from "@/lib/api";

export const useCreateAccount = () => {
  const accountCreation = api.account.createAccount.useMutation();

  const createAccount = async () => {
    const result = await accountCreation.mutateAsync();
    await fetch("/api/cookie", {
      method: "POST",
      body: JSON.stringify({
        name: "current_account_id",
        value: result.account_id,
      }),
    });

    return result.account_id;
  };

  return createAccount;
};

export const resetDataOnAccountChange = (
  utils: ReturnType<typeof api.useUtils>,
) => {
  utils.account.getAccountDetail.reset();
  utils.account.getPreferences.reset();
  utils.transaction.getTransactionsHistory.reset();
};
