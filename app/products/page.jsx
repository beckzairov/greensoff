import { Suspense } from "react";
import ProductCatalogue from "../components/ProductCatalogue";
export const metadata = { title: "Our agricultural solutions" };
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="catalogue-hero">
          <div className="section-shell">
            <h1>Greensoff</h1>
          </div>
        </main>
      }
    >
      <ProductCatalogue />
    </Suspense>
  );
}
