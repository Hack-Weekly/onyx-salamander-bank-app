import { create } from "zustand";

interface AccountState {
  currentAccount: number | null;
}

export const useAccountStore = create<AccountState>()((set) => ({
  currentAccount: null,
}));
