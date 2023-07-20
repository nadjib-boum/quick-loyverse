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
    if (err instanceof APIError) {
      res
        .status(err.getError().code)
        .send({ status: "error", error: { ...err.getError() } });
    }
    res.status(500).send({ status: "error", error: err });
  }
}

export default new ErrorMiddleware();
