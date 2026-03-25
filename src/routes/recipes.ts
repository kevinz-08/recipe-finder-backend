import { Router } from "express";
import { searchRecipes, getRecipeById } from "../services/spoonacular.service";
import { getRandomRecipes } from "../services/spoonacular.service";

const router = Router();

router.get("/popular", async (req, res) => {
  try {
    const data = await getRandomRecipes();
    res.json(data);
  } catch (error: any) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: error.message });
  }
});

// luego otras
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q as string;
    const data = await searchRecipes(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error searching recipes" });
  }
});

// ❗ SIEMPRE al final las dinámicas
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await getRecipeById(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipe" });
  }
});

export default router;
