import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"
import { IPostQuery } from "../post/post.interface";

const getPremiumContent = async (query: IPostQuery) =>{

    const limit = Math.max(1, query.limit ? Number(query.limit) : 10);
      const page = Math.max(1, query.page ? Number(query.page) : 1);
      const skip = (page - 1) * limit;
      
      const sortBy = query.sortBy || "createdAt";
      const sortOrder = query.sortOrder || "desc";
    
      // 2. Build Prisma Filter Conditions
      const andConditions:PostWhereInput[] = [];
    
      // Search filter
      if (query.searchTerm) {
        andConditions.push({
          OR: [
            { title: { contains: query.searchTerm, mode: "insensitive" } },
            { content: { contains: query.searchTerm, mode: "insensitive" } },
          ],
        });
      }
    
      // Exact match text filters
      if (query.title) andConditions.push({ title: query.title });
      if (query.content) andConditions.push({ content: query.content });
      if (query.authorId) andConditions.push({ authorId: query.authorId });
      if (query.status) andConditions.push({ status: query.status });
    
      // Safe Boolean parsing (handles string "false" correctly)
      if (query.isFeatured !== undefined) {
        andConditions.push({ isFeatured: String(query.isFeatured) === "true" });
      }
    
      // Safe Tags array parsing
      if (query.tags) {
        try {
          const parsedTags = typeof query.tags === 'string' ? JSON.parse(query.tags) : query.tags;
          const tagsArray = Array.isArray(parsedTags) ? parsedTags : [];
          if (tagsArray.length > 0) {
            andConditions.push({ tags: { hasSome: tagsArray } });
          }
        } catch (error) {
          // Optional: Log JSON parsing error or handle gracefully
          console.error("Failed to parse tags query parameter:", error);
        }
      }

      andConditions.push({
        isPremium : true
      })

    const post = await prisma.post.findMany({
        where : {
            AND : andConditions
        }
    })

     const totalPostCount = await prisma.post.count({
    where : {
      AND : andConditions
    }
  })

    return {
    data : post,
    meta : {
      page : page,
      limit : limit,
      total : totalPostCount,
      totalPages : Math.ceil(totalPostCount/limit)
    }
  };

}

export const premiumServices = {getPremiumContent}