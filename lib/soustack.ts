import { fromSchemaOrg, validateRecipe } from "soustack-core";
import type { RecipeContent } from "./recipes";

export type SoustackRecipe = {
  slug: string;
  title: string;
  summary?: string;
  ingredients: { text: string }[];
  steps: { text: string }[];
  yield?: string;
  totalTime?: string;
  source?: { name?: string; url?: string };
  schemaOrg?: Record<string, unknown>;
};

export type SoustackEnvelope = {
  format: "soustack-recipe";
  formatVersion: string;
  recipe: SoustackRecipe;
  links: {
    self: string;
    html: string;
  };
  "x-errors"?: string[];
};

export function toSoustackRecipe(recipe: RecipeContent): {
  recipe: SoustackRecipe;
  validation: ReturnType<typeof validateRecipe>;
} {
  const base = recipe.schemaOrg
    ? fromSchemaOrg(recipe.schemaOrg)
    : {
        slug: recipe.slug,
        title: recipe.title,
        summary: recipe.description,
        ingredients: recipe.ingredients.map((text) => ({ text })),
        steps: recipe.steps.map((text) => ({ text })),
        yield: recipe.yield,
        totalTime: recipe.totalTime,
        source: recipe.source
      };

  const normalized: SoustackRecipe = {
    ...base,
    slug: recipe.slug ?? base.slug,
    title: base.title || recipe.title,
    summary: base.summary || recipe.description,
    source: base.source || recipe.source,
    schemaOrg: recipe.schemaOrg
  };

  const validation = validateRecipe(normalized);

  return { recipe: normalized, validation };
}

export function buildEnvelope(slug: string, recipe: SoustackRecipe, errors?: string[]): SoustackEnvelope {
  const envelope: SoustackEnvelope = {
    format: "soustack-recipe",
    formatVersion: "2024-12",
    recipe,
    links: {
      self: `/soustack/recipes/${slug}.soustack.json`,
      html: `/recipes/${slug}`
    }
  };

  if (errors?.length) {
    envelope["x-errors"] = errors;
  }

  return envelope;
}
