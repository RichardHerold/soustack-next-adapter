import Link from "next/link";
import { getRecipeSlugs } from "@/lib/recipes";

export default async function HomePage() {
  const slugs = await getRecipeSlugs();

  return (
    <div className="stack">
      <div className="card">
        <p className="pill">Starter</p>
        <h2>Soustack + Next.js</h2>
        <p>
          This starter demonstrates how to publish Soustack recipe sidecars alongside a
          human-friendly recipe page using the Next.js App Router.
        </p>
        <p>
          Each recipe is stored in <code>content/recipes</code> and surfaced at both{" "}
          <code>/recipes/&lt;slug&gt;</code> and the sidecar endpoint{" "}
          <code>/soustack/recipes/&lt;slug&gt;.soustack.json</code>.
        </p>
      </div>

      <div className="card">
        <h3>Recipes</h3>
        <ul>
          {slugs.map((slug) => (
            <li key={slug}>
              <Link href={`/recipes/${slug}`}>{slug}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
