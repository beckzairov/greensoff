"use client";
import { useSyncExternalStore } from "react";
import i18n from "../../i18n";
import { siteCopy } from "../content/site";

function subscribe(onChange) {
  i18n.on("languageChanged", onChange);
  return () => i18n.off("languageChanged", onChange);
}

const getLanguage = () => i18n.resolvedLanguage || "ru";
const getServerLanguage = () => "ru";

export default function useSiteCopy() {
  // Restoring a saved language can happen before sibling components subscribe.
  // A snapshot subscription catches that change during hydration as well.
  const language = useSyncExternalStore(
    subscribe,
    getLanguage,
    getServerLanguage,
  );
  return siteCopy[language] || siteCopy.ru;
}
