import { title } from "node:process";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface";
import { PostWhereInput } from "../../../generated/prisma/models";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};


//Advance searching, filtering, pagination
// const getAllPosts = async (query : IPostQuery) => {

//   const limit = query.limit ? Number(query.limit) : 10;
//   const page = query.page ? Number(query.page) : 1;
//   const skip = (page - 1) * limit;
//   const sortBy = query.sortBy ? query.sortBy : "createdAt";
//   const sortOrder = query.sortOrder? query.sortOrder : "desc";

//   const tags = query.tags ? JSON.parse(query.tags as string) : null;
//   const tagsArray = Array.isArray(tags) ? tags : []


//   const andConditions : PostWhereInput[] = [];
//   if(query.searchTerm){
//     andConditions.push({
//        OR : [
//               { title : 
//                 {
//                   contains : query.searchTerm,
//                   mode : "insensitive"
//                 }
//               },
//               {
//                 content : 
//                 {
//                   contains : query.searchTerm,
//                   mode : "insensitive"
//                 }
//               }
//             ]
//     })
//   }

//   if(query.title){
//     andConditions.push({
//       title : query.title
//     })
//   }

//   if(query.content){
//     andConditions.push({
//       content : query.content
//     })
//   }

//   if(query.authorId){
//     andConditions.push({
//       authorId : query.authorId
//     })
//   }

//   if(query.isFeatured){
//     andConditions.push({
//       isFeatured : Boolean(query.isFeatured)
//     })
//   }

//   if(query.tags){
//     andConditions.push({
//       tags : {
//         hasSome : tagsArray
//       }
//     })
//   }

//   if(query.status){
//     andConditions.push({
//       status : query.status
//     })
//   }


//   const posts = await prisma.post.findMany({
    
//     where :{
//       AND : andConditions
//     },
//     take : limit,
//     skip : skip,
//     orderBy : {
//       [sortBy] : sortOrder
//     },


//     include: {
//       author: {
//         omit: { password: true },
//       },
//       comments: true,
//     },
//   });
//   return posts;
// };

export const getAllPosts = async (query: IPostQuery) => {
  // 1. Pagination & Sorting Defaults
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
    isPremium : false
  })

  // 3. Database Query Execution
  const posts = await prisma.post.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      author: {
        omit: { password: true },
      },
      comments: true,
    },
  });

  const totalPostCount = await prisma.post.count({
    where : {
      AND : andConditions
    }
  })

  return {
    data : posts,
    meta : {
      page : page,
      limit : limit,
      total : totalPostCount,
      totalPages : Math.ceil(totalPostCount/limit)
    }
  };
};


const getPostById = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId},
      data: {
        views: { increment: 1 },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: { id: postId, isPremium : false },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  });

  return transactionResult;
};

const getMyPost = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: { authorId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: { password: true },
      },

      _count: {
        select: { comments: true },
      },
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You don't permission to update this post.");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
  });

  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You don't permission to update this post.");
  }

  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return result;
};

const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalArchievedPost,
      totalDraftPost,
      totalPublishedPost,
      totalComments,
      totalAprovedComments,
      totalRejectedComments,
      totalPostViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await tx.post.aggregate({
        _sum: { views: true },
      }),
    ]);

    return {
        totalPosts,
      totalArchievedPost,
      totalDraftPost,
      totalPublishedPost,
      totalComments,
      totalAprovedComments,
      totalRejectedComments,
      totalPostViews
    }




  });

  return transactionResult;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  getPostsStats,
};
