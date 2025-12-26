import { NextResponse } from "next/server";
import { getRecipeBySlug } from "@/lib/recipes";
import { buildEnvelope, toSoustackRecipe } from "@/lib/soustack";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const { recipe: soustackRecipe, validation } = toSoustackRecipe(recipe);
  const headers = new Headers({
    "Content-Type": "application/vnd.soustack+json"
  });

  if (!validation.valid) {
    headers.set("X-Soustack-Valid", "false");
    if (process.env.NODE_ENV === "production") {
      const envelope = buildEnvelope(recipe.slug, soustackRecipe, validation.errors);
      return NextResponse.json(envelope, { status: 200, headers });
    }

    throw new Error(`Soustack recipe validation failed: ${validation.errors.join(", ")}`);
  }

  headers.set("X-Soustack-Valid", "true");
  const envelope = buildEnvelope(recipe.slug, soustackRecipe);
  return NextResponse.json(envelope, { status: 200, headers });
}
