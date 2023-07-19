import type { Request, Response, NextFunction } from "express";
import UserService from "../services/user";

export function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const token = UserService.login(username, password);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({ status: "success", data: { token } });
  } catch (err: any) {
    next(err);
  }
}

export function authCallback(req: Request, res: Response, next: NextFunction) {
  res.status(200).send({ status: "success" });
}

export function logout(req: Request, res: Response) {
  res.clearCookie("token");
  res.status(200).send({ status: "success" });
}
