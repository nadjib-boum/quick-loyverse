import type { Request, Response, NextFunction } from "express";
import APIError from "../utils/errors";
import { isValidObjectId } from "../helpers/validators";

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
