import { z } from "zod";

const createCommentValidationSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: "Content is required",
      })
      .min(1, "Content cannot be empty")
      .max(2000, "Content cannot exceed 2000 characters"),
    parentComment: z.string().optional(),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Content cannot be empty")
      .max(2000, "Content cannot exceed 2000 characters"),
  }),
});

export const CommentZodValidations = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};