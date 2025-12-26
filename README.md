# Soustack Next.js Adapter

This repository is a minimal reference implementation of Soustack sidecar publishing for the Next.js App Router. It exposes a human-friendly recipe page and a machine-readable Soustack payload that can be embedded elsewhere.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000/recipes/summer-pasta.

## Content model

- Recipes live in `content/recipes`. Add a new `*.json` file to publish a recipe.
- If a `schemaOrg` object is present in the JSON, the server will call `fromSchemaOrg()` from `soustack-core` to convert it into a Soustack recipe shape.
- Each recipe exports:
  - Human page: `/recipes/<slug>`
  - Sidecar: `/soustack/recipes/<slug>.soustack.json`

### Example recipe file

```json
{
  "slug": "summer-pasta",
  "title": "Summer Pasta with Burst Tomatoes",
  "description": "A fast weeknight pasta...",
  "ingredients": ["12 oz spaghetti", "2 tbsp olive oil"],
  "steps": ["Cook pasta", "Make sauce"],
  "schemaOrg": { "@context": "https://schema.org", "@type": "Recipe", "name": "Summer Pasta" }
}
```

## Sidecar endpoint

- Route: `/soustack/recipes/[slug].soustack.json`
- Content type: `application/vnd.soustack+json`
- Validation:
  - Uses `validateRecipe()` from `soustack-core`.
  - **Dev**: throws when invalid to surface errors early.
  - **Prod**: returns `X-Soustack-Valid: false` and an `x-errors` array in the payload while still emitting JSON.

### Response envelope

```json
{
  "format": "soustack-recipe",
  "formatVersion": "2024-12",
  "links": {
    "self": "/soustack/recipes/summer-pasta.soustack.json",
    "html": "/recipes/summer-pasta"
  },
  "recipe": {
    "slug": "summer-pasta",
    "title": "Summer Pasta with Burst Tomatoes",
    "ingredients": [{ "text": "12 oz spaghetti" }],
    "steps": [{ "text": "Cook pasta" }]
  }
}
```

## Discovery + embedding

Inside the recipe page, the `<head>` includes:

```html
<link
  rel="alternate"
  type="application/vnd.soustack+json"
  href="/soustack/recipes/<slug>.soustack.json"
/>
```

### Embed via script

```html
<script src="https://unpkg.com/@soustack/embed@latest/dist/embed.umd.js"></script>
<soustack-recipe data-src="/soustack/recipes/summer-pasta.soustack.json"></soustack-recipe>
```

### Embed via blocks

If you prefer to render your own UI, fetch the sidecar JSON directly. The `ingredients` and `steps` arrays are ready to map into custom components.

## Testing & CI

- `npm test` runs the local Soustack conformance script at `scripts/conformance.ts`.
- GitHub Actions (`.github/workflows/ci.yml`) runs:
  - `npm test`
  - The conformance script to ensure the generated payload is valid.

## Notes

- This starter is intentionally file-based; no database is required.
- The demo `soustack-core` package is vendored under `packages/soustack-core` to keep the starter self-contained.
