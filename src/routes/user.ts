import type { Router } from "express";
import { authorize, validateLogin } from "../middlewares/user";
import { login, authCallback, logout } from "../controllers/user";

export default (router: Router) => {
  router.post("/user/login", validateLogin, login);
  router.get("/user/auth", authorize, authCallback);
  router.get("/user/logout", authorize, logout);
};
