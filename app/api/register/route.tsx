import { NextApiRequest } from "next";

export async function GET(paramreq: NextApiRequest) {
    return new Response("SUP BRAH")
    
}

export async function POST(res: NextApiRequest) {
    const {email} = await res.body()
    return new Response(
        JSON.stringify({
            status: 200,
        })
    )
    
}