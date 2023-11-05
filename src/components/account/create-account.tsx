import CreateAccountButton from "./create-account-button";

export default function CreateAccount() {

  return (
    <div className="flex h-96 flex-col items-center justify-center">
      <div className="mb-4 text-sm font-medium">No accounts found</div>
      <CreateAccountButton />
    </div>
  );
}
