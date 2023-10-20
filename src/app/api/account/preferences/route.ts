import { NextResponse, NextRequest } from "next/server";
import { SavingsAccount } from "@/lib/user/savings-account";
import { IPerference } from "@/lib/user/preference.interface";

export async function POST (req: NextRequest) {
    const body = await req.json();
    const { account_id, transfer_limit } = body;
    
    const account: IPerference = new SavingsAccount(account_id);
    const result = await account.setPreferences({
        transfer_limit: transfer_limit
    });

    return NextResponse.json(result, { status: 200 });
}

export async function GET (req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const account_id = searchParams.get("account_id");
    
    if (!account_id) return NextResponse.next();

    const account: IPerference = new SavingsAccount(account_id);
    const result = await account.getPreferences();
    
    return NextResponse.json(result, { status: 200 });
}