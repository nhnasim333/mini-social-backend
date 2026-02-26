import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CommentZodValidations } from "./comment.validation";
import { CommentController } from "./comment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Create a comment
router.post(
  "/",
  auth("user", "superAdmin"),
  validateRequest(CommentZodValidations.createCommentValidationSchema),
  CommentController.createComment
);

// Get all comments
router.get("/",auth("user", "superAdmin"), CommentController.getAllComments);

// Get comment statistics
router.get("/statistics", auth("user", "superAdmin"), CommentController.getCommentStatistics);

// Get single comment
router.get("/:id",auth("user", "superAdmin"), CommentController.getSingleComment);

// Update comment ( only owner)
router.patch(
  "/:id",
  auth("user", "superAdmin"),
  validateRequest(CommentZodValidations.updateCommentValidationSchema),
  CommentController.updateComment
);

// Delete comment ( only owner)
router.delete(
  "/:id",
  auth("user", "superAdmin"),
  CommentController.deleteComment
);

// Like a comment
router.post(
  "/:id/like",
  auth("user", "superAdmin"),
  CommentController.likeComment
);

// Dislike a comment
router.post(
  "/:id/dislike",
  auth("user", "superAdmin"),
  CommentController.dislikeComment
);

// Get replies for a comment
router.get("/:id/replies", auth("user", "superAdmin"), CommentController.getReplies);

export const CommentRoutes = router;