import type { Router } from "express";
import { authorize } from "../middlewares/user";
import { login, authCallback, logout } from "../controllers/user";

export default (router: Router) => {
  router.post("/user/login", login);
  router.post("/user/auth", authorize, authCallback);
  router.post("/user/logout", authorize, logout);
};
