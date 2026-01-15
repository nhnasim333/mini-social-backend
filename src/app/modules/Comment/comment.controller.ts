import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentServices } from "./comment.service";

const createComment = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await CommentServices.createCommentIntoDB(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment created successfully",
    data: result,
  });
});

const getAllComments = catchAsync(async (req, res) => {
  const result = await CommentServices.getAllCommentsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comments retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const result = await CommentServices.getSingleCommentFromDB(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment retrieved successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const result = await CommentServices.updateCommentIntoDB(
    id,
    req.body,
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  await CommentServices.deleteCommentFromDB(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: null,
  });
});

const likeComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const result = await CommentServices.likeCommentInDB(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment liked/unliked successfully",
    data: result,
  });
});

const dislikeComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const result = await CommentServices.dislikeCommentInDB(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment disliked/undisliked successfully",
    data: result,
  });
});

const getReplies = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CommentServices.getRepliesFromDB(id, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Replies retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const CommentController = {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getReplies,
};