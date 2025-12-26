import { getRecipeSlugs, getRecipeBySlug } from "@/lib/recipes";
import { buildEnvelope, toSoustackRecipe } from "@/lib/soustack";

async function main() {
  const slugs = await getRecipeSlugs();
  if (!slugs.length) {
    console.warn("No recipes found in content/recipes");
    process.exit(0);
  }

  let hasErrors = false;

  for (const slug of slugs) {
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
      console.error(`Missing recipe for slug: ${slug}`);
      hasErrors = true;
      continue;
    }

    const { recipe: soustackRecipe, validation } = toSoustackRecipe(recipe);
    const envelope = buildEnvelope(slug, soustackRecipe, validation.errors);

    if (!validation.valid) {
      hasErrors = true;
      console.error(`Validation failed for ${slug}: ${validation.errors.join("; ")}`);
    } else {
      console.log(`✓ ${slug} validated`);
    }

    console.log(JSON.stringify(envelope, null, 2));
  }

  if (hasErrors) {
    process.exit(1);
  }
}

main();
