import type { Router } from "express";
import { authorize, validateLogin } from "../middlewares/user";
import { renderLogin, login, authCallback, logout } from "../controllers/user";

export default (router: Router) => {
  router.get("/user/login", validateLogin, renderLogin);
  router.post("/user/login", validateLogin, login);
  router.get("/user/auth", authorize, authCallback);
  router.get("/user/logout", authorize, logout);
};
