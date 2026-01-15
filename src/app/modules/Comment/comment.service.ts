import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { Types } from "mongoose";

// Create a new comment
const createCommentIntoDB = async (
  payload: Partial<TComment>,
  userId: string
) => {
  // If parentComment exists, verify it exists
  if (payload.parentComment) {
    const parentExists = await Comment.findById(payload.parentComment);
    if (!parentExists) {
      throw new AppError(httpStatus.NOT_FOUND, "Parent comment not found");
    }
  }

  const commentData = {
    ...payload,
    user: new Types.ObjectId(userId),
  };

  const result = await Comment.create(commentData);
  const populatedResult = await Comment.findById(result._id).populate(
    "user",
    "name email"
  );

  return populatedResult;
};

// Get all comments with pagination, sorting, and filtering
const getAllCommentsFromDB = async (query: Record<string, unknown>) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "newest",
    parentComment = null,
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Build filter
  const filter: Record<string, unknown> = {
    parentComment: parentComment === "null" ? null : parentComment,
  };

  // Determine sort order
  let sort: Record<string, 1 | -1> = {};
  if (sortBy === "newest") {
    sort = { createdAt: -1 };
  } else if (sortBy === "oldest") {
    sort = { createdAt: 1 };
  } else if (sortBy === "mostLiked") {
    sort = { likeCount: -1, createdAt: -1 };
  } else if (sortBy === "mostDisliked") {
    sort = { dislikeCount: -1, createdAt: -1 };
  }

  // Aggregate pipeline for advanced sorting with counts
  const comments = await Comment.aggregate([
    { $match: filter },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        dislikeCount: { $size: "$dislikes" },
      },
    },
    { $sort: sort },
    { $skip: skip },
    { $limit: limitNumber },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        content: 1,
        likes: 1,
        dislikes: 1,
        likeCount: 1,
        dislikeCount: 1,
        parentComment: 1,
        createdAt: 1,
        updatedAt: 1,
        userName: "$userDetails.name",
        userEmail: "$userDetails.email",
        user: 1,
      },
    },
  ]);

  const total = await Comment.countDocuments(filter);

  return {
    data: comments,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// Get single comment by ID
const getSingleCommentFromDB = async (id: string, userId?: string) => {
  const comment = await Comment.findById(id).populate("user", "name email");

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  // Add like/dislike status for current user
  const commentObj = comment.toObject();
  const result = {
    ...commentObj,
    likeCount: comment.likes.length,
    dislikeCount: comment.dislikes.length,
    hasLiked: userId ? comment.likes.includes(new Types.ObjectId(userId)) : false,
    hasDisliked: userId ? comment.dislikes.includes(new Types.ObjectId(userId)) : false,
  };

  return result;
};

// Update comment (only by owner)
const updateCommentIntoDB = async (
  id: string,
  payload: Partial<TComment>,
  userId: string
) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  // Check if user is the owner
  if (comment.user.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this comment"
    );
  }

  const result = await Comment.findByIdAndUpdate(
    id,
    { content: payload.content },
    { new: true, runValidators: true }
  ).populate("user", "name email");

  return result;
};

// Delete comment (soft delete, only by owner)
const deleteCommentFromDB = async (id: string, userId: string) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  // Check if user is the owner
  if (comment.user.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this comment"
    );
  }

  const result = await Comment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

// Like a comment
const likeCommentInDB = async (id: string, userId: string) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  const userObjectId = new Types.ObjectId(userId);

  // Check if user already liked
  const hasLiked = comment.likes.includes(userObjectId);
  const hasDisliked = comment.dislikes.includes(userObjectId);

  if (hasLiked) {
    // Unlike: remove from likes
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId
    );
  } else {
    // Like: add to likes and remove from dislikes if exists
    if (hasDisliked) {
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId
      );
    }
    comment.likes.push(userObjectId);
  }

  await comment.save();

  const result = await Comment.findById(id).populate("user", "name email");
  return result;
};

// Dislike a comment
const dislikeCommentInDB = async (id: string, userId: string) => {
  const comment = await Comment.findById(id);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  const userObjectId = new Types.ObjectId(userId);

  // Check if user already disliked
  const hasLiked = comment.likes.includes(userObjectId);
  const hasDisliked = comment.dislikes.includes(userObjectId);

  if (hasDisliked) {
    // Remove dislike
    comment.dislikes = comment.dislikes.filter(
      (id) => id.toString() !== userId
    );
  } else {
    // Dislike: add to dislikes and remove from likes if exists
    if (hasLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId
      );
    }
    comment.dislikes.push(userObjectId);
  }

  await comment.save();

  const result = await Comment.findById(id).populate("user", "name email");
  return result;
};

// Get replies for a comment
const getRepliesFromDB = async (
  parentCommentId: string,
  query: Record<string, unknown>
) => {
  const { page = 1, limit = 5 } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const replies = await Comment.find({ parentComment: parentCommentId })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const total = await Comment.countDocuments({
    parentComment: parentCommentId,
  });

  return {
    data: replies,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentsFromDB,
  getSingleCommentFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
  likeCommentInDB,
  dislikeCommentInDB,
  getRepliesFromDB,
};