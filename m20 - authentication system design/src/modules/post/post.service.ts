import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    
    //searching
    // where :{
    //   OR : [
    //     {
    //       title : { contains : "Ronaldo", mode : "insensitive"}
    //     },
    //     {
    //       content : {
    //         contains : "Ronaldo", mode : "insensitive"
    //       }
    //     }
    //   ]
    // },

    //combining search & filtering
    where :{
      //filtering
      AND : [
        {
          //searching
          OR : [
            { title : {
              contains : "Ron", mode : "insensitive"
            }},
            {
              content : { contains : "Ron", mode : "insensitive"}
            }
          ]

        },
        {title : "Ronaldo"},
        {content : "Ronaldo"}
      ]

    },



    include: {
      author: {
        omit: { password: true },
      },
      comments: true,
    },
  });
  return posts;
};

const getPostById = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: postId },
      data: {
        views: { increment: 1 },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: { id: postId },
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
