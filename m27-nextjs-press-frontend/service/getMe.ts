"use server"

import { cookies } from "next/headers"

export const getMe = async() =>{
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if(!accessToken){
        return {
            success : false,
            message : "user not logged in",

        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
        headers : {
            // Authorization : `${accessToken}`
            Cookie: `accessToken=${accessToken}`
        },
        cache : "force-cache",
        next : {
            revalidate : 60 * 60 * 24,
            tags : ["my-profile"]
        }
    })

    const result = res.json();


    return result
    


}