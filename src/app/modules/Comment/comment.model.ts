import { Schema, model, Model } from "mongoose";
import { TComment } from "./comment.interface";

type CommentModel = Model<TComment>;

const commentSchema = new Schema<TComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

commentSchema.index({ parentComment: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

export const Comment = model<TComment, CommentModel>(
  "Comment",
  commentSchema
);
