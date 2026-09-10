"use client";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiRotateCcw } from "react-icons/fi";
import { useSiteMotion } from "./MotionProvider";
import useSiteCopy from "../hooks/useSiteCopy";

export default function SeedStage() {
  const copy = useSiteCopy().experience;
  const { enabled } = useSiteMotion();
  const host = useRef(null);
  const viewer = useRef(null);
  const current = useRef({ enabled, planted: false });
  const [planted, setPlanted] = useState(false);
  const [ready, setReady] = useState(false);
  current.current = { enabled, planted };
  useEffect(() => {
    let cancelled = false;
    import("../lib/seedSculpture")
      .then(({ createSeedSculpture }) => {
        if (cancelled || !host.current) return;
        viewer.current = createSeedSculpture(host.current);
        viewer.current.setMotion(current.current.enabled);
        viewer.current.setPlanted(current.current.planted);
        setReady(true);
      })
      .catch(() => {
        /* The CSS seed arrangement remains visible without WebGL. */
      });
    return () => {
      cancelled = true;
      viewer.current?.dispose();
      viewer.current = null;
    };
  }, []);
  useEffect(() => {
    viewer.current?.setMotion(enabled);
  }, [enabled]);
  useEffect(() => {
    viewer.current?.setPlanted(planted);
  }, [planted]);
  return (
    <div className="seed-stage" data-planted={planted}>
      <div className="seed-stage-top">
        <span>GREENSOFF / 001</span>
        <span>{copy.seedLabel}</span>
      </div>
      <div className="seed-dial" aria-hidden="true" />
      <div
        className="seed-view"
        ref={host}
        role="img"
        aria-label={copy.sculpture}
      >
        {!ready && (
          <div className="seed-fallback" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i key={i} style={{ "--seed-index": i }} />
            ))}
          </div>
        )}
      </div>
      <div className="seed-stage-bottom">
        <span>{copy.seedHint}</span>
        <button
          type="button"
          onClick={() => setPlanted(!planted)}
          aria-pressed={planted}
        >
          {planted ? copy.gather : copy.scatter}
          {planted ? <FiRotateCcw /> : <FiArrowUpRight />}
        </button>
      </div>
    </div>
  );
}
