import { Router } from "express";
import { searchRecipes, getRecipeById } from "../services/spoonacular.service";
import { getRandomRecipes } from "../services/spoonacular.service";

const router = Router();

let cachedRecipes: any = null;
let lastFetchTime = 0;

const CACHE_DURATION = 1000 * 60 * 60 * 5;

// buscar recetas, ahora tiene filtros inteligentes ademas de las queries
router.get("/", async (req, res) => {
  try {
    const { query, cuisine, diet, sort, maxReadyTime } = req.query;

    const data = await searchRecipes({
      query: query as string,
      cuisine: cuisine as string,
      diet: diet as string,
      sort: sort as string,
      maxReadyTime: maxReadyTime as string,
    });

    res.json(data);
  } catch (error) {
    console.error("Error en /recipes:", error);
    res.status(500).json({ error: "Error searching recipes" });
  }
});

router.get("/popular", async (req, res) => {
  try {
    const now = Date.now();

    // usar cache si no ha expirado
    if (cachedRecipes && now - lastFetchTime < CACHE_DURATION) {
      console.log("Usando cache (backend)");
      return res.json(cachedRecipes);
    }

    //llamar la api
    console.log("Llamando a Spoonacular...");
    const data = await getRandomRecipes();

    cachedRecipes = data;
    lastFetchTime = now;

    res.json(data);
  } catch (error: any) {
    console.error("Error en /popular:", error);

    // fallback si ya habia cache
    if (cachedRecipes) {
      return res.json(cachedRecipes);
    }

    res.status(500).json({ error: "Error fetching popular recipes" });
  }
});

// get by id
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
