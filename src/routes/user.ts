import { Router, Request, Response } from "express";
import jsonresponse from "../lib/jsonresponse";
import authenticate from "../auth/authenticate";

const router = Router();

router.get("/", authenticate, (req: Request, res: Response): Response => {
  return res.status(200).json(jsonresponse(200, req.user));
});

export default router;