import { api } from "@/lib/api";
import { useAccountStore } from "@/lib/store";

export const useCreateAccount = () => {
  const accountCreation = api.account.createAccount.useMutation();
  const { changeAccount } = useAccountStore();

  const createAccount = async () => {
    const result = await accountCreation.mutateAsync();
    fetch("/api/cookie", {
      method: "POST",
      body: JSON.stringify({
        name: "current_account_id",
        value: result.account_id,
      }),
    }).then(() => {
      changeAccount(result.account_id);
      resetDataOnAccountChange();
    });
  };

  return createAccount;
};

export const resetDataOnAccountChange = () => {
  const utils = api.useUtils();

  utils.account.getAccountDetail.reset();
  utils.account.getPreferences.reset();
  utils.transaction.getTransactionsHistory.reset();
};
