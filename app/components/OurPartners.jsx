"use client";
import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FiArrowUpRight } from "react-icons/fi";
import { partners } from "../content/site";
import useSiteCopy from "../hooks/useSiteCopy";
export default function OurPartners() {
  const copy = useSiteCopy();
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const active = partners[selected];
  return (
    <section id="partners" className="section-space partners-section">
      <div className="section-shell">
        <p className="eyebrow">{copy.partnerEyebrow}</p>
        <div className="section-heading">
          <h2>{copy.partnerTitle}</h2>
          <p>{copy.partnerIntro}</p>
        </div>
        <div className="partner-explorer">
          <div className="partner-list" role="group" aria-label={copy.partners}>
            {partners.map((partner, index) => (
              <button
                type="button"
                key={partner.name}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <span className="partner-number">0{index + 1}</span>
                {partner.name}
                <FiArrowUpRight />
              </button>
            ))}
          </div>
          <article className="partner-detail" aria-live="polite">
            <span className="eyebrow">GREENSOFF × {active.name.toUpperCase()}</span>
            <Image
              src={active.logo}
              alt={active.name}
              width={230}
              height={115}
            />
            <p>{t(`our_partners.${active.key}`)}</p>
            <span className="partner-pagination">
              {String(selected + 1).padStart(2, "0")} <span>/ 01</span>
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}
