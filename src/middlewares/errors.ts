import { Request, Response, NextFunction } from "express";

class ErrorMiddleware {
  logger(err: any, req: Request, res: Response, next: NextFunction) {
    console.log("############## ERROR_START ##############");
    console.log(err);
    console.log("############## ERROR_END ##############");

    next(err);
  }

  handler(err: any, req: Request, res: Response, next: NextFunction) {
    res.status(500).send({ status: "error", error: err });
  }
}

export default new ErrorMiddleware();
