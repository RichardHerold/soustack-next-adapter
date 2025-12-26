const sanitize = (value) =>
  value
    ?.toString()
    .trim()
    .replace(/\s+/g, " ");

export function normalizeRecipe(recipe = {}) {
  const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  return {
    slug: sanitize(recipe.slug),
    title: sanitize(recipe.title),
    summary: sanitize(recipe.summary),
    ingredients: ingredients
      .map((entry) => (typeof entry === "string" ? { text: entry } : entry))
      .filter((entry) => Boolean(entry?.text)),
    steps: steps
      .map((entry) => (typeof entry === "string" ? { text: entry } : entry))
      .filter((entry) => Boolean(entry?.text)),
    yield: recipe.yield ? sanitize(recipe.yield) : undefined,
    totalTime: recipe.totalTime ? sanitize(recipe.totalTime) : undefined,
    source: recipe.source,
    schemaOrg: recipe.schemaOrg
  };
}

export function fromSchemaOrg(schema = {}) {
  const instructions = Array.isArray(schema.recipeInstructions) ? schema.recipeInstructions : [];

  return normalizeRecipe({
    slug: schema.slug || schema.identifier || schema["@id"],
    title: schema.name || schema.headline,
    summary: schema.description,
    ingredients: schema.recipeIngredient || [],
    steps: instructions.map((step) => {
      if (typeof step === "string") return { text: step };
      if (typeof step === "object") {
        return {
          text: step.text || step.name || step.description
        };
      }
      return null;
    }),
    yield: schema.recipeYield,
    totalTime: schema.totalTime || schema.cookTime || schema.prepTime,
    source: schema.url ? { url: schema.url } : undefined,
    schemaOrg: schema
  });
}

export function validateRecipe(recipe) {
  const normalized = normalizeRecipe(recipe);
  const errors = [];

  if (!normalized.slug) {
    errors.push("slug is required");
  }

  if (!normalized.title) {
    errors.push("title is required");
  }

  if (!normalized.ingredients.length) {
    errors.push("at least one ingredient is required");
  }

  if (!normalized.steps.length) {
    errors.push("at least one instruction is required");
  }

  return { valid: errors.length === 0, errors, recipe: normalized };
}
