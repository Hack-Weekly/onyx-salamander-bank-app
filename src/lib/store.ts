import { create } from "zustand";

interface AccountState {
  current_account_id: string | null;
  changeAccount: (to: string) => void;
}

export const useAccountStore = create<AccountState>()((set) => ({
  current_account_id: null,
  changeAccount: (to) => set(() => ({ current_account_id: to })),
}));
