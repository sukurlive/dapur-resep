const RECIPES_PER_PAGE = 10;

export function paginateRecipes(recipes, requestedPage) {
  const pageCount = Math.max(1, Math.ceil(recipes.length / RECIPES_PER_PAGE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const start = (page - 1) * RECIPES_PER_PAGE;
  const items = recipes.slice(start, start + RECIPES_PER_PAGE);
  return { page, pageCount, start, items };
}
