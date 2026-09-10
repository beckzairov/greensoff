"use client";
import Image from "next/image";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import useSiteCopy from "../hooks/useSiteCopy";
export default function About() {
  const copy = useSiteCopy();
  return (
    <section id="about" className="section-space about">
      <div className="section-shell about-grid">
        <div className="about-photo">
          <Image
            src="/farmfield.png"
            alt={copy.network}
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
          />
          <div className="photo-label">
            <span>GREENSOFF</span>
            <span>
              {copy.address}
              <FiArrowUpRight />
            </span>
          </div>
        </div>
        <div className="about-copy">
          <p className="eyebrow">{copy.aboutEyebrow}</p>
          <h2>{copy.aboutTitle}</h2>
          <p className="about-lead">{copy.aboutIntro}</p>
          <p>{copy.aboutBody}</p>
          <div className="about-stats">
            <div>
              <strong>
                Hazera<span>↗</span>
              </strong>
              <p>{copy.established}</p>
            </div>
            <div>
              <strong>UZ</strong>
              <p>{copy.team}</p>
            </div>
          </div>
          <div className="about-assurances">
            <span>
              <FiCheck />
              {copy.network}
            </span>
            <span>
              <FiCheck />
              {copy.direct}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
