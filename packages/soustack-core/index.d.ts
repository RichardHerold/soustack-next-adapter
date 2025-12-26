export type SoustackCoreRecipe = {
  slug?: string;
  title?: string;
  summary?: string;
  ingredients?: Array<string | { text: string }>;
  steps?: Array<string | { text: string }>;
  yield?: string;
  totalTime?: string;
  source?: { name?: string; url?: string };
  schemaOrg?: Record<string, unknown>;
};

export type SoustackValidation = {
  valid: boolean;
  errors: string[];
  recipe: Required<Pick<SoustackCoreRecipe, "slug" | "title">> &
    Pick<SoustackCoreRecipe, "summary" | "ingredients" | "steps" | "yield" | "totalTime" | "source" | "schemaOrg">;
};

export function normalizeRecipe(recipe?: SoustackCoreRecipe): SoustackCoreRecipe;
export function fromSchemaOrg(schema?: Record<string, unknown>): SoustackCoreRecipe;
export function validateRecipe(recipe: SoustackCoreRecipe): SoustackValidation;
