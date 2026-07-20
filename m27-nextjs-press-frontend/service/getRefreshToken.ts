"use server"

import { cookies } from "next/headers"

export const getNewAccessToken = async() =>{
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if(!refreshToken){
        return {
            success : false,
            message : "Refresh Token not found",

        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh-token`, {
        method : "POST",
        headers : {
            // Authorization : `${accessToken}`
            
            Cookie: `refreshToken=${refreshToken}`
        },
        cache : "no-cache"
    })

    const result = await res.json();


    return result
    


}