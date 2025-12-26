import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getRecipeBySlug, getRecipeSlugs } from "@/lib/recipes";
import { toSoustackRecipe } from "@/lib/soustack";

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    return { title: "Recipe not found" };
  }

  const href = `/soustack/recipes/${params.slug}.soustack.json`;

  return {
    title: `${recipe.title} | Soustack demo`,
    description: recipe.description,
    alternates: {
      types: {
        "application/vnd.soustack+json": href
      }
    }
  };
}

export default async function RecipePage({ params }: PageProps) {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    notFound();
  }

  const { recipe: soustackRecipe, validation } = toSoustackRecipe(recipe);
  const sidecarHref = `/soustack/recipes/${recipe.slug}.soustack.json`;

  return (
    <>
      <Script src="https://unpkg.com/@soustack/embed@latest/dist/embed.umd.js" strategy="lazyOnload" />

      <article className="card stack">
        <header>
          <p className="pill">Recipe</p>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
          <p>
            View the structured sidecar:{" "}
            <Link href={sidecarHref} target="_blank" rel="noreferrer">
              {sidecarHref}
            </Link>
          </p>
          <p>
            Validation:{" "}
            {validation.valid ? (
              <span className="pill" aria-label="valid">
                ✓ valid
              </span>
            ) : (
              <span className="pill" aria-label="invalid">
                ⚠ invalid
              </span>
            )}
          </p>
        </header>

        <section>
          <h3 className="section-title">Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="section-title">Steps</h3>
          <ol>
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="stack">
          <div>
            <h3 className="section-title">Embed via script</h3>
            <p>
              Drop the <code>@soustack/embed</code> script and reference the sidecar URL to render the
              canonical recipe widget:
            </p>
            <pre>{`<script src="https://unpkg.com/@soustack/embed@latest/dist/embed.umd.js"></script>
<soustack-recipe data-src="${sidecarHref}"></soustack-recipe>`}</pre>
          </div>
          <div>
            <h3 className="section-title">Embed via blocks</h3>
            <p>
              If you prefer to hydrate your own UI, use the structured payload directly. The{" "}
              <code>steps</code> and <code>ingredients</code> arrays match the Soustack schema:
            </p>
            <pre>{JSON.stringify(soustackRecipe, null, 2)}</pre>
          </div>
        </section>
      </article>
    </>
  );
}
