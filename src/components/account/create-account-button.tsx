import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { resetDataOnAccountChange, useCreateAccount } from "./hooks";
import { toast } from "sonner";
import { useAccountStore } from "@/lib/store";
import { api } from "@/lib/api";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  onProcessed?: () => void;
};

export default function CreateAccountButton({
  onProcessed,
  ...props
}: ButtonProps) {
  const createAccount = useCreateAccount();
  const { changeAccount } = useAccountStore();
  const utils = api.useUtils();

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button {...props}>Create Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm account creation?</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new bank account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                createAccount().then((account_id) => {
                  changeAccount(account_id);
                  resetDataOnAccountChange(utils);
                  toast.success("Succesfully created account.");
                  if (onProcessed) {
                    onProcessed();
                  }
                })
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
