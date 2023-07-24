import type { Request, Response, NextFunction } from "express";
import APIError from "../utils/errors";

export function validateTokenRefresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new APIError({
        code: 400,
        label: "REFRESH_TOKEN_FAILED",
        description: "company id is invalid",
      });
    }

    next();
  } catch (err: any) {
    next(err);
  }
}
