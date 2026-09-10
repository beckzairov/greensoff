"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
const MotionContext = createContext({ enabled: false, toggle: () => {} });
export function useSiteMotion() {
  return useContext(MotionContext);
}
export default function MotionProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  return (
    <MotionContext.Provider
      value={{ enabled, toggle: () => setEnabled((value) => !value) }}
    >
      <MotionConfig reducedMotion={enabled ? "user" : "always"}>
        <div data-motion={enabled ? "on" : "off"}>{children}</div>
      </MotionConfig>
    </MotionContext.Provider>
  );
}
