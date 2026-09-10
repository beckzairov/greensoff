"use client";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useSiteCopy from "../hooks/useSiteCopy";
export default function Footer() {
  const copy = useSiteCopy();
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="footer-main">
          <div>
            <Link href="/" aria-label="Greensoff">
              <Image
                src="/brand/greensoff-logo-light.svg"
                alt="Greensoff"
                width={232}
                height={64}
              />
            </Link>
            <p>{copy.footerLine}</p>
          </div>
          <div className="footer-links">
            <Link href="/products">{copy.solutions}</Link>
            <Link href="/#about">{copy.story}</Link>
            <Link href="/#partners">{copy.partners}</Link>
          </div>
          <address>
            {copy.address}
            <br />
            <span>{copy.street}</span>
          </address>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Greensoff. {t("footer.rights")}
          </span>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            {t("footer.back_to_top")}
            <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
