import translations from "./recipes-id.json";

const names = translations.names;
const ingredients = translations.ingredients;
const instructions = translations.instructions;
const categories = {
  Appetizer: "Hidangan pembuka",
  Beverage: "Minuman",
  Breakfast: "Sarapan",
  Dessert: "Hidangan penutup",
  Dinner: "Makan malam",
  Lunch: "Makan siang",
  "Side Dish": "Hidangan pendamping",
  Snack: "Camilan",
  Snacks: "Camilan",
};
const cuisines = {
  American: "Amerika Serikat",
  Asian: "Asia",
  Brazilian: "Brasil",
  Greek: "Yunani",
  Hawaiian: "Hawaii",
  Indian: "India",
  Italian: "Italia",
  Japanese: "Jepang",
  Korean: "Korea",
  Lebanese: "Lebanon",
  Mediterranean: "Mediterania",
  Mexican: "Meksiko",
  Moroccan: "Maroko",
  Pakistani: "Pakistan",
  Russian: "Rusia",
  Spanish: "Spanyol",
  Thai: "Thailand",
  Turkish: "Turki",
  Vietnamese: "Vietnam",
};

function lookup(dictionary, value) {
  return Object.hasOwn(dictionary, value) ? dictionary[value] : value;
}

// A changed step from the API falls back to its original text instead of receiving an older translation.
function stepKey(step) {
  let hash = 2166136261;
  for (let index = 0; index < step.length; index += 1) {
    hash = Math.imul(hash ^ step.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function recipeName(name) {
  return lookup(names, name);
}

export function recipeCategories(recipe) {
  return [
    ...new Set(recipe.mealType.map((category) => lookup(categories, category))),
  ];
}

export function recipeCuisineLabel(recipe) {
  const cuisine = recipe.cuisine?.trim();
  if (!cuisine || cuisine === "Smoothie" || cuisine === "Cocktail") {
    return "General";
  }
  return lookup(cuisines, cuisine);
}

export function recipeCategoryLabel(recipe) {
  return recipeCategories(recipe).join(" · ");
}

export function recipeIngredient(ingredient) {
  return lookup(ingredients, ingredient);
}

export function recipeInstruction(step) {
  return instructions[stepKey(step)] ?? step;
}

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchesRecipeValue(original, localized, keyword) {
  const query = normalize(keyword);
  return (
    normalize(original).includes(query) || normalize(localized).includes(query)
  );
}

export function mergeNameMatches(apiMatches, catalog, keyword) {
  const matches = new Map(apiMatches.map((recipe) => [recipe.id, recipe]));
  for (const recipe of catalog) {
    if (
      !matches.has(recipe.id) &&
      matchesRecipeValue(recipe.name, recipeName(recipe.name), keyword)
    ) {
      matches.set(recipe.id, recipe);
    }
  }
  return [...matches.values()];
}
