import { api } from "@/lib/api";

export const useCreateAccount = () => {
  const accountCreation = api.account.createAccount.useMutation();
  const utils = api.useUtils();

  const createAccount = async () => {
    await accountCreation.mutateAsync();
    utils.account.invalidate();
  };

  return createAccount;
};
