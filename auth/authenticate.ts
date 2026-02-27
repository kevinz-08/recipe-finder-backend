import { Request, Response, NextFunction } from "express";
import jsonresponse from "../lib/jsonresponse";
import getTokenFromHeader from "./getTokenFromHeader";
import { verifyAccessToken } from "./verifyToken";

const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = getTokenFromHeader(req.headers);

  if (!token) {
    res.status(401).json(
      jsonresponse(401, {
        message: "No token Provided",
      })
    );
    return;
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    res.status(401).json(
      jsonresponse(401, {
        message: "Invalid token",
      })
    );
    return;
  }

  req.user = { ...decoded.user };

  next();
};

export default authenticate;