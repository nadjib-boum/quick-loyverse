import type { Request, Response, NextFunction } from "express";
import APIError from "../utils/errors";

export function validate_loyverseAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { companyId } = req.params;
    const { loyverse_token } = req.body;
    if (!companyId) {
      const error = new APIError({
        code: 400,
        label: "SAVING_LOYVERSE_ACCESS_TOKEN_FAILED",
        description: "companyId is missing",
      });
      throw error;
    }
    if (!loyverse_token) {
      const error = new APIError({
        code: 400,
        label: "SAVING_LOYVERSE_ACCESS_TOKEN_FAILED",
        description: "loyverse token is missing",
      });
      throw error;
    }
    next();
  } catch (err: any) {
    next(err);
  }
}
