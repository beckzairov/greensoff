"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiArrowLeft, FiX } from "react-icons/fi";
import useSiteCopy from "../hooks/useSiteCopy";

export default function ProductCatalogue() {
  const copy = useSiteCopy();
  const router = useRouter();
  const query = useSearchParams();
  const requested = query.get("category");
  const category = requested === "seeds" ? "seeds" : "all";
  const [selectedId, setSelectedId] = useState(null);
  const dialog = useRef(null);
  const products = [
    {
      id: "hazera",
      name: copy.cropNames[0],
      category: "seeds",
      image: "/media/solution-seeds.webp",
      description: copy.categories[0].description,
      detail: copy.categories[0].detail,
      brands: copy.categories[0].brands,
    },
  ];
  const selected = products.find((item) => item.id === selectedId);
  useEffect(() => {
    if (selectedId && !dialog.current.open) dialog.current.showModal();
  }, [selectedId]);
  function close() {
    dialog.current.close();
    setSelectedId(null);
  }
  const visible = products.filter(
    (item) => category === "all" || item.category === category,
  );
  return (
    <main id="main-content">
      <section className="catalogue-hero">
        <div className="section-shell">
          <Link href="/" className="text-link">
            <FiArrowLeft />
            {copy.back}
          </Link>
          <h1>{copy.catalogue}</h1>
          <p>{copy.catalogueIntro}</p>
        </div>
      </section>
      <section className="section-shell catalogue-content">
        <div
          className="catalogue-filters"
          role="group"
          aria-label={copy.solutions}
        >
          {[{ id: "all", label: copy.all }, ...copy.categories.filter((item) => item.id === "seeds")].map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === category}
              onClick={() =>
                router.replace(
                  item.id === "all"
                    ? "/products"
                    : `/products?category=${item.id}`,
                  { scroll: false },
                )
              }
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="catalogue-grid">
          {visible.map((product) => (
            <article className="product-card" key={product.id}>
              <div
                className={`product-art ${product.category !== "seeds" ? "material" : ""}`}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 850px) 50vw, 33vw"
                />
              </div>
              <div className="product-copy">
                <span>
                  {
                    copy.categories.find((item) => item.id === product.category)
                      .label
                  }
                </span>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <button type="button" onClick={() => setSelectedId(product.id)}>
                  {copy.details}
                  <FiArrowUpRight />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <dialog
        ref={dialog}
        className="product-dialog"
        onClose={() => setSelectedId(null)}
        onClick={(event) => {
          if (event.target === dialog.current) {
            const rect = dialog.current.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              close();
          }
        }}
        aria-labelledby="product-title"
      >
        {selected && (
          <>
            <button
              type="button"
              className="dialog-close"
              onClick={close}
              aria-label={copy.close}
            >
              <FiX />
            </button>
            <Image
              src={selected.image}
              alt=""
              width={400}
              height={200}
              className="dialog-image"
            />
            <h2 id="product-title">{selected.name}</h2>
            <p>{selected.detail}</p>
            <span className="dialog-brands">{selected.brands}</span>
            <p>{copy.available}</p>
            <Link
              className="button button-lime"
              href="/#shops"
              onClick={close}
            >
              {copy.enquire}
              <FiArrowUpRight />
            </Link>
          </>
        )}
      </dialog>
    </main>
  );
}
