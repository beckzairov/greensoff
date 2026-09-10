"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { heroMedia } from "../content/media";
import { useSiteMotion } from "./MotionProvider";

export default function HeroMedia() {
  const video = useRef(null);
  const [ready, setReady] = useState(false);
  const { enabled } = useSiteMotion();

  useEffect(() => {
    const player = video.current;
    if (!player || !heroMedia.video) return;
    let inView = false;
    const sync = () => {
      if (
        enabled &&
        inView &&
        !document.hidden &&
        !navigator.connection?.saveData
      ) {
        if (!player.src) player.src = heroMedia.video;
        player.play().catch(() => setReady(false));
      } else player.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(player);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      player.pause();
    };
  }, [enabled]);

  return (
    <div className="hero-landscape">
      <Image
        src={heroMedia.poster}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={90}
      />
      {heroMedia.video && (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          poster={heroMedia.poster}
          aria-hidden="true"
          className={ready && enabled ? "hero-video ready" : "hero-video"}
          onLoadedData={() => setReady(true)}
          onError={() => setReady(false)}
        />
      )}
    </div>
  );
}
