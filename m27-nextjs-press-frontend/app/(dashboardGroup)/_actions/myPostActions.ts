/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getNewAccessToken, isAccessTokenExits } from "@/service/getRefreshToken";
import { jwtUtils } from "@/utils/jwt";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type PostState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Record<string, any>;
};

export const getMyPosts = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    return {
      success: false,
      message: "user not logged in",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/my-posts`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-posts"],
    },
  });

  const result = res.json();

  return result;
};

export const createPost = async (prevState: PostState, formData: FormData) => {
  const payload = {
    title: formData.get("title"),
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail"),
    tags: (formData.get("tags") as string).split(", "),
    isPremium: formData.get("isPremium") === "on",
  };

  const accessToken = await isAccessTokenExits()


  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
  }

  if (result.success && result.data.isPremium) {
    revalidateTag("premium-posts", {
      expire: 0,
    });
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;

  return {};
};

export const updatePost = async (
  postId: string,
  prevState: PostState,
  formData: FormData,
) => {
  const payload = {
    title: formData.get("title") ?? "",
    content: formData.get("content") ?? "",
    thumbnail: formData.get("thumbnail") ?? "",
    tags: (formData.get("tags") as string).split(", ") ?? "",
    isPremium: formData.get("isPremium") === "on",
  };

  const cookieStore = await cookies();
  const accessToken = await isAccessTokenExits();
  if (!accessToken) {
    return {
      success: false,
      message: "user not logged in",
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await res.json();

  if (result.success) {
    revalidateTag("my-posts", {
      expire: 0,
    });
  }

  if (result.success && result.data.isPremium) {
    revalidateTag("premium-posts", {
      expire: 0,
    });
  } else {
    revalidateTag("public-posts", {
      expire: 0,
    });
  }

  return result;

  return {};
};
