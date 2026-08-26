import { Router, Request, Response } from "express";
import Favorite from "../schema/favorite";
import authenticate from "../auth/authenticate";

const router = Router();

// 🔐 proteger rutas
router.use(authenticate);

// GET /favorites
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const favorites = await Favorite.find({ userId });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Error fetching favorites" });
  }
});

// POST /favorites
router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id, title, image } = req.body;

    const favorite = await Favorite.create({
      userId,
      recipeId: id,
      title,
      image,
    });

    res.json(favorite);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Already exists" });
    }

    res.status(500).json({ error: "Error adding favorite" });
  }
});

// DELETE /favorites/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const recipeId = Number(req.params.id);

    await Favorite.findOneAndDelete({ userId, recipeId });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error removing favorite" });
  }
});

export default router;