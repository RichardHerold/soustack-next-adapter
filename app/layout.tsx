import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soustack Next.js Adapter",
  description: "Demo Next.js implementation for Soustack recipe sidecars"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <h1>Soustack Next.js Adapter</h1>
            <p className="subtitle">
              Reference implementation for Soustack recipe sidecar publishing with the Next.js App Router.
            </p>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              Built for the Soustack reference workflow. Edit content in{" "}
              <code>content/recipes</code> to publish new recipes.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
