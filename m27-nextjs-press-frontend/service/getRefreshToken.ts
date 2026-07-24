"use server"

import { jwtUtils } from "@/utils/jwt";
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


export const isAccessTokenExits = async () =>{
    const cookieStore = await cookies();
    
      let accessToken = cookieStore.get("accessToken")?.value || null;
      const refreshToken = cookieStore.get("refreshToken")?.value || null;
    
        if (!accessToken && !refreshToken) {
        return {
          success: false,
          message: "user not logged in",
        };
      }
    
      const decodedAccessToken = await (accessToken ? jwtUtils.varifyToken(accessToken, process.env.JWT_ACCESS_SCRETE as string) : null);
      const decodedRefreshToken = await (refreshToken ? jwtUtils.varifyToken( refreshToken, process.env.JWT_REFRESH_SECRETE as string): null);
    
      if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
          const result = await getNewAccessToken();
          if (result.success) {
            const newAccessToken = result.data.accessToken;
            cookieStore.set("accessToken", newAccessToken, {
              httpOnly: true,
              maxAge: 60 * 60 * 24,
              sameSite: "lax",
            });
      
            accessToken = newAccessToken;
            
          }
        }

    return accessToken;
    
}