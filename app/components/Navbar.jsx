"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import LanguageSwitcher from "./LanguageSwitcher";
import useSiteCopy from "../hooks/useSiteCopy";
export default function Navbar() {
  const copy = useSiteCopy();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const links = [
    ["/products", copy.solutions],
    ["/#about", copy.story],
    ["/#partners", copy.partners],
  ];
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>
      <nav className="section-shell nav-inner" aria-label={copy.menu}>
        <Link
          href="/"
          className="brand"
          aria-label="Greensoff"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/greensoff-logo-dark.svg"
            alt="Greensoff"
            width={232}
            height={64}
            priority
          />
          
        </Link>
        <div className="desktop-nav">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <LanguageSwitcher />
          <Link href="/#shops" className="nav-contact">
            {copy.contact}
            <FiArrowUpRight />
          </Link>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label={copy.menu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
        {open && (
          <div id="mobile-navigation" className="mobile-nav">
            {[...links, ["/#shops", copy.contact]].map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
                <FiArrowUpRight />
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
