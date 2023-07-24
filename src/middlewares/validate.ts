import type { Request, Response, NextFunction } from "express";
import APIError from "../utils/errors";

export function validateId(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new APIError({
        code: 400,
        label: "Unauthorized",
        description: "id is invalid",
      });
    }

    next();
  } catch (err: any) {
    next(err);
  }
}
