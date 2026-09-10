"use client";
import { useRef } from "react";
import HeroMedia from "./HeroMedia";
import Link from "next/link";
import { FiArrowDown, FiArrowUpRight, FiPause, FiPlay } from "react-icons/fi";
import { useSiteMotion } from "./MotionProvider";
import useSiteCopy from "../hooks/useSiteCopy";
export default function Hero() {
  const copy = useSiteCopy();
  const { enabled, toggle } = useSiteMotion();
  const section = useRef(null);
  function move(event) {
    if (!enabled || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    section.current.style.setProperty(
      "--pointer-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 14}px`,
    );
    section.current.style.setProperty(
      "--pointer-y",
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * 10}px`,
    );
  }
  return (
    <section className="hero" ref={section} onPointerMove={move}>
      <HeroMedia />
      <div className="hero-shade" />
      <div className="section-shell hero-content">
        <p className="eyebrow">
          <span className="status-dot" />
          {copy.eyebrow}
        </p>
        <h1>
          {copy.title}
          <br />
          <span>{copy.accent}</span>
        </h1>
        <p className="hero-intro">{copy.intro}</p>
        <div className="hero-links">
          <Link href="/products" className="button button-lime">
            {copy.explore}
            <FiArrowUpRight />
          </Link>
          <a href="#about" className="text-link">
            {copy.discover}
            <FiArrowUpRight />
          </a>
        </div>
      </div>
      <div className="landscape-note" aria-hidden="true">
        <span className="note-cross">+</span>
        <span>
          GREENSOFF / UZBEKISTAN
          <br />
          {copy.landscapeNote}
        </span>
      </div>
      <div className="hero-bottom section-shell">
        <a href="#solutions" className="scroll-cue">
          <span className="round-icon">
            <FiArrowDown />
          </span>
          {copy.scroll}
        </a>
        <span className="hero-since">{copy.since}</span>
        <button
          type="button"
          className="motion-toggle"
          onClick={toggle}
          aria-label={enabled ? copy.pause : copy.play}
          title={enabled ? copy.pause : copy.play}
        >
          {enabled ? <FiPause /> : <FiPlay />}
        </button>
      </div>
    </section>
  );
}
