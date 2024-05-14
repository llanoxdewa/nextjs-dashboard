import { NextRequest, NextResponse } from "next/server"
import { fetchCustomers } from "@/app/lib/data"


export async function GET(req: NextRequest){
    const customers = await fetchCustomers()
    return NextResponse.json({
        customers
    })
}

