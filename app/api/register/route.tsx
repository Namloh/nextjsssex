import prisma from "@/lib/prismaHelper";
import { NextApiRequest } from "next";

/*
export async function GET(paramreq: NextApiRequest) {
    return new Response("SUP BRAH")
    
}
*/
export async function POST(req: any) {
    const {email} = await req.json()

    const userExists = await prisma.user.findUnique({
        where:{
            email: email,
        }
    })

    if(userExists){
        return new Response(
            JSON.stringify({
                message: "uaise sialaready aesaxists",
                status: 409,
            })
        )
    }


    const user = await prisma.user.create({
        data: {
            email,
        }
    })
    if(!user){
        return new Response(
            JSON.stringify({
                message: "server sereror",
                status: 500,
            })
        )
    }
    return new Response(
        JSON.stringify({
            message: "regisrtere",
            status: 200,
        })
    )
 
    
}