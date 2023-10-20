import { NextResponse, type NextRequest } from "next/server";
import { SavingsAccount } from "@/lib/user/savings-account";
import { IAccount } from "@/lib/user/account.interface";

export async function POST (req: NextRequest) {
    const body = await req.json();
    const { account_id, transfer_to, amount } = body;
    
    const account: IAccount = new SavingsAccount(account_id);
    const result = await account.transferMoney(transfer_to, amount);

    return NextResponse.json(result, { status: 200 });
}