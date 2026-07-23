export const GetNews = async () => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 1,
      tags: ["posts"],
    },
  });

  const result = await res.json();

  return result;
};
