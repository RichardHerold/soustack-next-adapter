import fs from "fs/promises";
import path from "path";

export type RecipeContent = {
  slug: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  yield?: string;
  totalTime?: string;
  source?: { name?: string; url?: string };
  schemaOrg?: Record<string, unknown>;
};

const recipesDir = path.join(process.cwd(), "content", "recipes");

async function readRecipeFile(slug: string): Promise<RecipeContent | null> {
  const filePath = path.join(recipesDir, `${slug}.json`);
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(file);
    return json as RecipeContent;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function getRecipeSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(recipesDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => entry.name.replace(/\.json$/, ""));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function getRecipeBySlug(slug: string): Promise<RecipeContent | null> {
  return readRecipeFile(slug);
}

export async function getAllRecipes(): Promise<RecipeContent[]> {
  const slugs = await getRecipeSlugs();
  const recipes = await Promise.all(slugs.map((slug) => readRecipeFile(slug)));
  return recipes.filter(Boolean) as RecipeContent[];
}
