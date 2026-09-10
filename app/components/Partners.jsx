"use client";
import Image from "next/image";
import { partners } from "../content/site";
import useSiteCopy from "../hooks/useSiteCopy";
export default function Partners() {
  const copy = useSiteCopy();
  return (
    <section className="partner-ribbon">
      <div className="section-shell">
        <p className="eyebrow">{copy.trusted}</p>
        <div className="partner-logos">
          {partners.map((partner) => (
            <a key={partner.name} href="#partners" aria-label={partner.name}>
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={55}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
