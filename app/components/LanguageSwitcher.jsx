"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiChevronDown, FiGlobe } from "react-icons/fi";
import "../../i18n";
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("greensoff-language");
      if (saved === "en" || saved === "ru") i18n.changeLanguage(saved);
    } catch {
      /* Storage is optional. */
    }
  }, [i18n]);
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage || "ru";
  }, [i18n.resolvedLanguage]);
  useEffect(() => {
    const close = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  const language = i18n.resolvedLanguage === "en" ? "en" : "ru";
  const chooseLanguage = (nextLanguage) => {
    i18n.changeLanguage(nextLanguage);
    setOpen(false);
    try {
      localStorage.setItem("greensoff-language", nextLanguage);
    } catch {
      /* Storage is optional. */
    }
  };
  return (
    <div className="language-picker" ref={root}>
      <button
        type="button"
        className="language-trigger"
        aria-label="Language / Язык"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <FiGlobe aria-hidden="true" />
        <span>{language.toUpperCase()}</span>
        <FiChevronDown className={open ? "is-open" : ""} aria-hidden="true" />
      </button>
      {open && (
        <div className="language-menu" role="listbox" aria-label="Language / Язык">
          {[{ id: "ru", label: "Русский", short: "RU" }, { id: "en", label: "English", short: "EN" }].map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={language === option.id}
              className={language === option.id ? "is-selected" : ""}
              key={option.id}
              onClick={() => chooseLanguage(option.id)}
            >
              <span><b>{option.short}</b>{option.label}</span>
              {language === option.id && <FiCheck aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
