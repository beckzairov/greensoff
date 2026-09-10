"use client";
import Link from "next/link";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import useSiteCopy from "../hooks/useSiteCopy";

export default function Shops() {
  const copy = useSiteCopy();
  return (
    <section id="shops" className="section-space shops-section">
      <div className="section-shell shops-grid">
        <div>
          <p className="eyebrow">{copy.shopsEyebrow}</p>
          <h2>{copy.shopsTitle}</h2>
          <p className="shops-intro">{copy.shopsIntro}</p>
          <Link href="/products" className="button button-lime">
            {copy.shopsCta}<FiArrowUpRight />
          </Link>
        </div>
        <div className="shop-network-card">
          <FiMapPin aria-hidden="true" />
          <span className="eyebrow">GREENSOFF</span>
          <h3>{copy.address}</h3>
          <p>{copy.network}</p>
          <p className="shop-address-note">{copy.shopsNote}</p>
        </div>
      </div>
    </section>
  );
}
