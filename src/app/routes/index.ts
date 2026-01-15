import express from "express";
import { UserRoutes } from "../modules/User/user.route";
import { CommentRoutes } from "../modules/Comment/comment.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/comments",
    route: CommentRoutes,
  }
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
