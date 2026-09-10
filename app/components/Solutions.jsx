"use client";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import useSiteCopy from "../hooks/useSiteCopy";
export default function Solutions() {
  const copy = useSiteCopy();
  const solutionImages = {
    seeds: "/media/solution-seeds.webp",
    shops: "/media/greensoff-fields.webp",
    about: "/media/solution-seeds.webp",
  };
  return (
    <section id="solutions" className="section-space solutions">
      <div className="section-shell">
        <p className="eyebrow">{copy.solutionEyebrow}</p>
        <div className="section-heading">
          <h2>{copy.solutionTitle}</h2>
          <p>{copy.solutionIntro}</p>
        </div>
        <div className="solution-grid">
          {copy.categories.map((category, index) => (
            <Link
              href={category.href}
              className={`solution-card solution-${category.id}`}
              key={category.id}
            >
              <div className="solution-art">
                <span className="card-index">
                  0{index + 1} / {category.tag}
                </span>
                <Image
                  src={solutionImages[category.id]}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                  className="solution-photo"
                />
                <span className="card-arrow">
                  <FiArrowUpRight />
                </span>
              </div>
              <div className="solution-copy">
                <h3>{category.label}</h3>
                <p>{category.description}</p>
                <span className="card-brands">{category.brands}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
