import type { Request, Response, NextFunction } from "express";
import UserService from "../services/user";
import APIError from "../utils/errors";

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new APIError({
        code: 400,
        label: "LOGIN_FAILED",
        description: "username or password is missing",
      });
    }
    next();
  } catch (err: any) {
    next(err);
  }
}

export function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new APIError({
        code: 401,
        label: "Unauthorized",
        description: "token is missing",
        details: `token: ${token}`,
      });
    }

    UserService.authorize(token);

    next();
  } catch (err: any) {
    next(err);
  }
}
