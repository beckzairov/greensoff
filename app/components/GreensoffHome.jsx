"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiPause,
  FiPlay,
  FiPlus,
} from "react-icons/fi";
import SeedStage from "./SeedStage";
import StayInformed from "./StayInformed";
import { useSiteMotion } from "./MotionProvider";
import useSiteCopy from "../hooks/useSiteCopy";

function Reveal({ children, className = "" }) {
  const { enabled } = useSiteMotion();
  return (
    <motion.div
      className={className}
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: enabled ? 0.8 : 0, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SeedPacket({ copy }) {
  return (
    <div className="g-packet" aria-hidden="true">
      <div className="g-packet-fold" />
      <span className="g-packet-kicker">{copy.packetTop}</span>
      <span className="g-packet-brand">
        greensoff<span>®</span>
      </span>
      <div className="g-packet-window">
        <div className="g-seed-mark">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="g-packet-label">
        <span>
          HAZERA
          <br />
          {copy.packetBottom}
        </span>
        <span>
          01
          <br />↗
        </span>
      </div>
    </div>
  );
}

function SeasonJourney({ copy }) {
  const [selected, setSelected] = useState(0);
  const step = copy.steps[selected];
  return (
    <section className="g-journey" id="journey">
      <div className="g-shell">
        <Reveal className="g-section-heading">
          <p className="g-kicker">{copy.journeyLabel}</p>
          <h2>{copy.journeyTitle}</h2>
        </Reveal>
        <div className="g-journey-layout">
          <div
            className="g-step-list"
            role="group"
            aria-label={copy.journeyHint}
          >
            {copy.steps.map((item, index) => (
              <button
                className="g-step"
                key={item.title}
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                aria-controls="season-story"
              >
                <span className="g-step-number">0{index + 1}</span>
                <span className="g-step-name">{item.title}</span>
                <FiPlus />
                {selected === index && (
                  <span className="g-step-description">{item.text}</span>
                )}
              </button>
            ))}
          </div>
          <div
            className="g-season-visual"
            data-step={selected}
            id="season-story"
            aria-live="polite"
          >
            <div className="g-season-art" aria-hidden="true">
              <div className="g-season-sun" />
              <div className="g-field-rows">
                {Array.from({ length: 9 }, (_, i) => (
                  <i key={i} style={{ "--row": i }} />
                ))}
              </div>
              <div className="g-field-seeds">
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i} style={{ "--grain": i }} />
                ))}
              </div>
              <span className="g-field-word">
                {selected === 2 ? "UZ" : selected === 1 ? "02" : "01"}
              </span>
            </div>
            <div className="g-season-caption">
              <span>{step.subtitle}</span>
              <p>{step.visual}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GreensoffHome() {
  const site = useSiteCopy();
  const copy = site.experience;
  const { enabled, toggle } = useSiteMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <main id="main-content" className="g-home">
      <motion.div
        className="g-reading-progress"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <section className="g-hero g-shell">
        <div className="g-hero-copy">
          <p className="g-kicker">
            <span className="g-dot" />
            {copy.issue}
          </p>
          <h1>
            {copy.heroFirst}
            <em>{copy.heroSecond}</em>
          </h1>
          <p className="g-hero-description">{copy.heroText}</p>
          <Link href="/products" className="g-button">
            {site.explore}
            <span>
              <FiArrowUpRight />
            </span>
          </Link>
          <div className="g-hero-foot">
            <span>GREENSOFF × HAZERA</span>
            <span>
              {site.address}
              <FiArrowDown />
            </span>
          </div>
        </div>
        <SeedStage />
        <div className="g-hero-end">
          <span>{site.since}</span>
          <button
            type="button"
            onClick={toggle}
            aria-label={enabled ? site.pause : site.play}
          >
            {copy.motion}
            {enabled ? <FiPause /> : <FiPlay />}
          </button>
        </div>
      </section>
      <div className="g-ticker" aria-label={copy.strip.join(" · ")}>
        <div aria-hidden="true">
          {[0, 1].map((set) => (
            <span key={set}>
              {copy.strip.map((word) => (
                <span key={word}>
                  <b>✳</b>
                  {word}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <section className="g-introduction g-shell" id="about">
        <p className="g-kicker">{copy.introLabel}</p>
        <Reveal className="g-intro-body">
          <h2>{copy.introTitle}</h2>
          <div>
            <span className="g-asterisk" aria-hidden="true">
              ✳
            </span>
            <p>{copy.introText}</p>
          </div>
        </Reveal>
      </section>
      <section className="g-seed-feature g-shell" id="solutions">
        <Reveal className="g-packet-display">
          <div className="g-packet-shadow" />
          <SeedPacket copy={copy} />
          <span className="g-display-caption">GREENSOFF — {site.address}</span>
        </Reveal>
        <Reveal className="g-feature-copy">
          <p className="g-kicker">HAZERA / GREENSOFF</p>
          <h2>{copy.seedTitle}</h2>
          <p>{copy.seedText}</p>
          <Link href="/products" className="g-inline-link">
            {site.details}
            <FiArrowUpRight />
          </Link>
          <div className="g-feature-note">
            <span>↳</span>
            {copy.seedNote}
          </div>
        </Reveal>
      </section>
      <SeasonJourney copy={copy} />
      <section className="g-partner g-shell" id="partners">
        <Reveal className="g-partner-heading">
          <p className="g-kicker">{copy.partnerLabel}</p>
          <h2>{copy.partnerTitle}</h2>
        </Reveal>
        <div className="g-partner-board">
          <span className="g-big-brand">greensoff</span>
          <span className="g-partner-cross">×</span>
          <Image
            src="/partners/hazera.svg"
            width={240}
            height={100}
            alt="Hazera"
          />
        </div>
        <p className="g-partner-description">{copy.partnerText}</p>
      </section>
      <section className="g-shops" id="shops">
        <div className="g-shell g-shops-layout">
          <Reveal className="g-shops-copy">
            <p className="g-kicker">{copy.shopLabel}</p>
            <h2>{copy.shopTitle}</h2>
            <p>{copy.shopText}</p>
            <span className="g-shop-tag">↗ {copy.shopTag}</span>
            <p className="g-shop-note">{copy.shopNote}</p>
          </Reveal>
          <div className="g-shop-scene" aria-hidden="true">
            <div className="g-shop-building">
              <div className="g-shop-sign">
                greensoff<span>× HAZERA</span>
              </div>
              <div className="g-shop-awning" />
              <div className="g-shop-front">
                <div className="g-shop-window">
                  <span>✳</span>
                  <p>{copy.shopWindow}</p>
                </div>
                <div className="g-shop-door">
                  <i />
                  <b />
                </div>
              </div>
              <div className="g-shop-step" />
            </div>
            <span className="g-shop-ground" />
          </div>
        </div>
      </section>
      <StayInformed />
      <div className="g-signoff g-shell">
        <p>{copy.footerLine}</p>
        <span aria-hidden="true">
          greensoff<span>®</span>
        </span>
      </div>
    </main>
  );
}
