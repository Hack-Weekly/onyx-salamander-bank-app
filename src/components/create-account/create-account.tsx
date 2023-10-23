import CreateAccountButton from "./create-account-button";

export default function CreateAccount() {
    return (
        <div className="flex flex-col h-96 justify-center items-center">
            <div className="text-sm font-medium">No accounts found</div>
            <CreateAccountButton />
        </div>
    )
}