const BASE_URL = "https://api.spoonacular.com";

export async function searchRecipes(query: string) {
  const res = await fetch(
    `${BASE_URL}/recipes/complexSearch?query=${query}&number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`,
  );

  if (!res.ok) throw new Error("Error fetching recipes");

  return res.json();
}

export async function getRecipeById(id: number) {
  const res = await fetch(
    `${BASE_URL}/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`,
  );

  if (!res.ok) throw new Error("Error fetching recipe");

  return res.json();
}

export async function getRandomRecipes() {
    console.log("API KEY:", process.env.SPOONACULAR_API_KEY);
  const res = await fetch(
    `https://api.spoonacular.com/recipes/random?number=12&apiKey=${process.env.SPOONACULAR_API_KEY}`
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Spoonacular dice:", text);
    throw new Error(text);
  }

  return res.json();
}
