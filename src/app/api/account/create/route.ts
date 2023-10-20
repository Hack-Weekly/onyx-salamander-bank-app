import { type NextRequest } from "next/server";
import { SavingsAccount } from "@/lib/user/savings-account";
import { IAccount } from "@/lib/user/account.interface";

export async function POST (req: NextRequest) {
    const body = await req.json();
    const { user_id } = body;
    
    const account: IAccount = new SavingsAccount();
    const result = await account.createAccount(user_id);

    return Response.json(result);
}