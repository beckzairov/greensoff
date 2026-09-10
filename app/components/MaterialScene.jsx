"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FiRotateCcw,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { agriculturalModels } from "../content/models";
import { useSiteMotion } from "./MotionProvider";
import useSiteCopy from "../hooks/useSiteCopy";

export default function MaterialScene({ selected, label }) {
  const host = useRef(null);
  const viewer = useRef(null);
  const current = useRef({ selected, enabled: false });
  const [ready, setReady] = useState(false);
  const { enabled } = useSiteMotion();
  const copy = useSiteCopy();
  current.current = { selected, enabled };

  useEffect(() => {
    let cancelled = false;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        try {
          const { createMaterialViewer } = await import(
            "../lib/materialViewer"
          );
          if (cancelled) return;
          viewer.current = createMaterialViewer(host.current, {
            onReady: (value) => {
              if (!cancelled) setReady(value);
            },
            onError: () => {
              if (!cancelled) setReady(false);
            },
          });
          viewer.current.setMotion(current.current.enabled);
          viewer.current.setModel(
            agriculturalModels[current.current.selected].url,
          );
        } catch {
          if (!cancelled) setReady(false);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(host.current);
    return () => {
      cancelled = true;
      observer.disconnect();
      viewer.current?.dispose();
      viewer.current = null;
    };
  }, []);
  useEffect(() => {
    viewer.current?.setModel(agriculturalModels[selected].url);
  }, [selected]);
  useEffect(() => {
    viewer.current?.setMotion(enabled);
  }, [enabled]);

  const controls = [
    [FiChevronLeft, copy.rotateLeft, () => viewer.current?.rotate(-1)],
    [FiChevronRight, copy.rotateRight, () => viewer.current?.rotate(1)],
    [FiPlus, copy.zoomIn, () => viewer.current?.zoom(1)],
    [FiMinus, copy.zoomOut, () => viewer.current?.zoom(-1)],
    [FiRotateCcw, copy.resetView, () => viewer.current?.reset()],
  ];
  return (
    <div className="model-viewer" role="group" aria-label={label}>
      <div className="material-scene" ref={host} data-ready={ready}>
        <Image
          className="model-poster"
          src={agriculturalModels[selected].poster}
          alt=""
          fill
          sizes="(max-width: 850px) 100vw, 50vw"
        />
      </div>
      <div className="model-toolbar" aria-label={copy.modelControls}>
        {controls.map(([Icon, title, action]) => (
          <button
            key={title}
            type="button"
            onClick={action}
            aria-label={title}
            title={title}
            disabled={!ready}
          >
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}
