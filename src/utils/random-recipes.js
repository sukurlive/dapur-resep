export function pickRandomRecipes(recipes, count = 4, random = Math.random) {
  const pool = [...recipes];
  const limit = Math.min(count, pool.length);

  // Shuffle only the positions used by the recommendations.
  for (let index = 0; index < limit; index += 1) {
    const other = index + Math.floor(random() * (pool.length - index));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }

  return pool.slice(0, limit);
}
