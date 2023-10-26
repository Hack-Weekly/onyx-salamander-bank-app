import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AccountState {
  current_account_id: string | null;
  changeAccount: (to: string | null) => void;
  clearStore: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      current_account_id: null,
      changeAccount: (to) => set(() => ({ current_account_id: to })),
      clearStore: () => {
        set(() => {
          return { current_account_id: null };
        });
      },
    }),
    {
      name: "account-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
