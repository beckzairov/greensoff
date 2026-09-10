"use client";
import { useState } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiMove, FiPause, FiPlay } from "react-icons/fi";
import MaterialScene from "./MaterialScene";
import { useSiteMotion } from "./MotionProvider";
import useSiteCopy from "../hooks/useSiteCopy";
export default function Elements() {
  const copy = useSiteCopy();
  const [selected, setSelected] = useState(0);
  const { enabled, toggle } = useSiteMotion();
  return (
    <section id="elements" className="elements section-space">
      <div className="section-shell elements-grid">
        <div className="elements-copy">
          <p className="eyebrow">{copy.elementEyebrow}</p>
          <h2>{copy.elementTitle}</h2>
          <p>{copy.elementIntro}</p>
          <div
            className="element-tabs"
            role="group"
            aria-label={copy.solutions}
          >
            {copy.elementLabels.map((label, index) => (
              <button
                key={label}
                type="button"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <span>0{index + 1}</span>
                {label}
              </button>
            ))}
          </div>
          <p className="element-description" aria-live="polite">
            {copy.elementDescriptions[selected]}
          </p>
          <Link
            href="/products"
            className="text-link"
          >
            {copy.more}
            <FiArrowUpRight />
          </Link>
        </div>
        <div className="scene-wrap">
          <span className="scene-coordinate" aria-hidden="true">
            {String(selected + 1).padStart(2, "0")} /{" "}
            {copy.modelNames[selected]}
          </span>
          <MaterialScene
            selected={selected}
            label={`${copy.scene}: ${copy.modelNames[selected]}`}
          />
          <div className="scene-caption">
            <span>
              <FiMove />
              {copy.interactive}
            </span>
            <button
              type="button"
              className="motion-toggle"
              onClick={toggle}
              aria-label={enabled ? copy.pause : copy.play}
            >
              {enabled ? <FiPause /> : <FiPlay />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
