import type { Router } from "express";
import { authorize, validateLogin, redirectToHome } from "../middlewares/user";
import { renderLogin, login, authCallback, logout } from "../controllers/user";

export default (router: Router) => {
  router.get("/user/login", redirectToHome, renderLogin);
  router.post("/user/login", validateLogin, login);
  router.get("/user/auth", authorize, authCallback);
  router.get("/user/logout", authorize, logout);
};
