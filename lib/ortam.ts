"use client";

// Tarayıcı ortamı okumaları (medya sorguları, WebGL desteği) için abonelikli kancalar.
// Sunucuda verilen varsayılan değer kullanılır, istemcide gerçek değerle eşlenir.

import { useSyncExternalStore } from "react";

export function useMedya(sorgu: string, sunucuDegeri = false): boolean {
  return useSyncExternalStore(
    (bildir) => {
      const mq = window.matchMedia(sorgu);
      mq.addEventListener("change", bildir);
      return () => mq.removeEventListener("change", bildir);
    },
    () => window.matchMedia(sorgu).matches,
    () => sunucuDegeri,
  );
}

export const useAzHareket = () => useMedya("(prefers-reduced-motion: reduce)");

let webglOnbellek: boolean | null = null;
function webglVar(): boolean {
  if (webglOnbellek !== null) return webglOnbellek;
  try {
    const c = document.createElement("canvas");
    webglOnbellek = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglOnbellek = false;
  }
  return webglOnbellek;
}

const hicAbone = () => () => {};

/** WebGL desteği (sunucuda true varsayılır) */
export function useWebgl(): boolean {
  return useSyncExternalStore(hicAbone, webglVar, () => true);
}
