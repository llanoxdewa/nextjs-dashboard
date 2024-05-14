import { NextRequest, NextResponse } from "next/server";



export function GET(req: NextRequest){
    const response = new NextResponse('hello from nextjs !!',{
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'owner': 'llano kusuma dewa'
        }
    })

    return response;
}

