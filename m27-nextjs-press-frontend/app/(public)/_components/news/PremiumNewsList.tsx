/* eslint-disable @typescript-eslint/no-explicit-any */

import { IPost } from "@/lib/types";
import { NewsCard } from "./NewsCard";
import { getPremiumNews } from "../../_actions/getPremiumNews";

export async function PremiumNewsList({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  const result = await getPremiumNews();

  console.log(result);
  

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No news found.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.data.map((post : IPost) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
      
    </div>
  );
}
