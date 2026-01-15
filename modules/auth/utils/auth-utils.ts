"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

//protecting routes that require authentication (new way from nextjs16)
export const requireAuth = async () =>{
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(!session){
        redirect('/login')
    }

    return session;
}

export const requireUnAuth = async () =>{
    const session = await auth.api.getSession({
        headers : await headers()
    })

    if(session){
        redirect('/')
    }

    return session;
}