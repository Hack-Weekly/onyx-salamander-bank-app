import { NextResponse, type NextRequest } from "next/server";
import { SavingsAccount } from "@/lib/user/savings-account";
import { IAccount } from "@/lib/user/account.interface";

export async function GET (req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const account_id = searchParams.get("account_id");
    
    if (!account_id) return NextResponse.next();

    const account: IAccount = new SavingsAccount(account_id);
    const result = await account.getAccountDetails();
    
    return NextResponse.json(result, { status: 200 });
}