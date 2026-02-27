import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response): Response => {
  return res.json([
    {
      id: 1,
      title: "John Doe",
      completed: false,
    },
  ]);
});

export default router;