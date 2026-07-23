"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getSubscriptionStatus = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    return {
      success: false,
      message: "user not logged in",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/subscription/status`, {
    method : "GET",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    
  });

  const result = await res.json();
  return result
};
