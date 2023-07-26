import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "../helpers/validators";
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

export function validate_loyverseAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { companyId } = req.params;
    const { loyverse_token } = req.body;
    if (!isValidObjectId(companyId)) {
      throw new APIError({
        code: 400,
        label: "SAVING_LOYVERSE_ACCESS_TOKEN_FAILED",
        description: "companyId is invalid",
      });
    }
    if (!loyverse_token) {
      throw new APIError({
        code: 400,
        label: "SAVING_LOYVERSE_ACCESS_TOKEN_FAILED",
        description: "loyverse token is missing",
      });
    }
    next();
  } catch (err: any) {
    next(err);
  }
}
