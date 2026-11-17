import { queryOptions } from "@tanstack/react-query";

import { matchesRecipeValue, recipeIngredient } from "@/localization/recipes";

async function request(path, signal) {
  const response = await fetch("https://dummyjson.com" + path, { signal });
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}

export function recipesQuery(keyword) {
  return queryOptions({
    queryKey: ["recipes", "list", keyword],
    queryFn: async ({ signal }) => {
      const path = keyword
        ? "/recipes/search?q=" + encodeURIComponent(keyword) + "&limit=0"
        : "/recipes?limit=0";
      const data = await request(path, signal);
      return data.recipes;
    },
  });
}

export function recipeQuery(id) {
  return queryOptions({
    queryKey: ["recipes", "detail", id],
    queryFn: ({ signal }) => request("/recipes/" + id, signal),
    enabled: Number.isSafeInteger(id) && id > 0,
  });
}

export function filterByIngredient(recipes, keyword) {
  return recipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) =>
      matchesRecipeValue(ingredient, recipeIngredient(ingredient), keyword),
    ),
  );
}
