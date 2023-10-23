import { api } from "@/lib/api";
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

export default function CreateAccountButton() {
  const accountCreation = api.account.createAccount.useMutation();
  const utils = api.useUtils();

  const createAccount = async () => {
    await accountCreation.mutateAsync();
    utils.account.invalidate();
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Create Account</Button>
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
            <AlertDialogAction onClick={createAccount}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
