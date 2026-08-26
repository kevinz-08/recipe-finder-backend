const BASE_URL = "https://api.spoonacular.com";

type SearchParams = {
  query?: string;
  cuisine?: string;
  diet?: string;
  sort?: string;
  maxReadyTime?: string;
};

export async function searchRecipes(params: SearchParams) {
  const url = new URL(`${BASE_URL}/recipes/complexSearch`);

  if (params.query) url.searchParams.append("query", params.query);
  if (params.cuisine && params.cuisine !== "All Categories") {
    url.searchParams.append("cuisine", params.cuisine.toLowerCase());
  }

  if (params.diet) url.searchParams.append("diet", params.diet.toLowerCase());

  // filtros inteligentes
  if (params.sort === "Popularity") {
    url.searchParams.append("sort", "popularity");
  }

  if (params.sort === "Healthy" && !params.diet) {
    url.searchParams.append("diet", "healthy");
  }

  if (params.sort === "Fast") {
    url.searchParams.append("maxReadyTime", "20");
  } else if (params.maxReadyTime) {
    url.searchParams.append("maxReadyTime", params.maxReadyTime);
  }

  url.searchParams.append("apiKey", process.env.SPOONACULAR_API_KEY!);

  const response = await fetch(url.toString());

  if (!response.ok) throw new Error("Error fetching recipes");

  return response.json();
}

export async function getRandomRecipes() {
  const res = await fetch(
    `${BASE_URL}/recipes/random?number=12&apiKey=${process.env.SPOONACULAR_API_KEY}`,
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Spoonacular dice:", text);
    throw new Error(text);
  }

  return res.json();
}

export async function getRecipeById(id: number) {
  const API_KEY = process.env.SPOONACULAR_API_KEY;

  const [infoRes, nutritionRes] = await Promise.all([
    fetch(`${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`),
    fetch(`${BASE_URL}/recipes/${id}/nutritionWidget.json?apiKey=${API_KEY}`),
  ]);

  if (!infoRes.ok) {
    throw new Error("Error fetching recipe info");
  }

  const info = await infoRes.json();

  // nutrición puede fallar
  let nutrition = null;
  if (nutritionRes.ok) {
    const n = await nutritionRes.json();
    nutrition = {
      calories: n.calories,
      protein: n.protein,
      carbs: n.carbs,
      fat: n.fat,
    };
  }

  // limpieza y adaptación para frontend
  return {
    id: info.id,
    title: info.title,
    image: info.image,
    summary: info.summary?.replace(/<[^>]+>/g, ""), // quitar HTML
    readyInMinutes: info.readyInMinutes,
    servings: info.servings,

    extendedIngredients: info.extendedIngredients || [],
    analyzedInstructions: info.analyzedInstructions || [],

    nutrition,
  };
}
