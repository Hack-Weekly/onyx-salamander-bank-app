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
import { useCreateAccount } from "./hooks";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export default function CreateAccountButton(props: ButtonProps) {
  const createAccount = useCreateAccount();

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
            <AlertDialogAction onClick={() => createAccount()}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
