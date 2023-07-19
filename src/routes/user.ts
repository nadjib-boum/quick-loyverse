import type { Router } from "express";
import { authorize, validateLogin } from "../middlewares/user";
import { login, authCallback, logout, renderLogin } from "../controllers/user";

export default (router: Router) => {
  router.get("/user/login", renderLogin);
  router.post("/user/login", validateLogin, login);
  router.get("/user/auth", authorize, authCallback);
  router.get("/user/logout", authorize, logout);
};
