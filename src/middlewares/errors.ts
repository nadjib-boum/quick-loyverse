import APIError from "../utils/errors";
import type { Request, Response, NextFunction } from "express";

class ErrorMiddleware {
  logger(err: any, req: Request, res: Response, next: NextFunction) {
    console.log("############## ERROR_START ##############");
    console.log(err);
    console.log("##############  ERROR_END  ##############");

    next(err);
  }

  handler(err: any, req: Request, res: Response, next: NextFunction) {
    const code = err instanceof APIError ? err.getError().code : 500;
    res.status(code).send({ status: "error", error: err });
  }
}

export default new ErrorMiddleware();
