import { Types } from "mongoose";

export interface TComment {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  parentComment?: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TCommentResponse extends TComment {
  likeCount: number;
  dislikeCount: number;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  userName?: string;
  userEmail?: string;
  replies?: TCommentResponse[];
}
