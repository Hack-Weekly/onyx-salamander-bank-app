import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AccountState {
  current_account_id: string | null;
  changeAccount: (to: string | null) => void;
  hasAccount: boolean;
  setHasAccount: (to: boolean) => void;
  clearStore: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      current_account_id: null,
      changeAccount: (to) => set(() => ({ current_account_id: to })),
      hasAccount: false,
      setHasAccount: (to) => set(() => ({ hasAccount: to })),
      clearStore: () => {
        set(() => {
          return { current_account_id: null, hasAccount: false };
        });
      },
    }),
    {
      name: "account-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
