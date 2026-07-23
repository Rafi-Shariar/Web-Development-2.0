'use server'
import { cookies } from "next/headers";

export const getPremiumNews = async ({query} : {query ?: {[key: string]: string | string[] | undefined}}) => {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    return {
      success: false,
      message: "user not logged in",
    };
  }

  const params = new URLSearchParams()
  if(query && query.searchTerm){
    params.set("searchTerm", query.searchTerm as string)
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/premium?${params.toString()}`, {
    headers : {
            Cookie: `accessToken=${accessToken}`
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 6,
      tags: ["premium-posts"],
    },
  });

  const result = await res.json();

  return result;
};
