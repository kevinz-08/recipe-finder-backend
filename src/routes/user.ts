import { Router, Request, Response } from "express";
import jsonresponse from "../lib/jsonresponse";

const router = Router();

router.get("/", (req: Request, res: Response): Response => {
  return res.status(200).json(jsonresponse(200, req.user));
});

export default router;