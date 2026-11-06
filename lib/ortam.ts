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
/** WebGL ve donanım hızlandırması var mı (sonuç önbellekte tutulur). İlk çağrı bir GL bağlamı açar. */
export function webglVar(): boolean {
  if (webglOnbellek !== null) return webglOnbellek;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      webglOnbellek = false;
    } else {
      // Donanım hızlandırması yoksa (yazılım çizici) sahne her karede ana iş parçacığını kilitler:
      // bu durumda düz görsel gösterilir. ?sahne=zorla ile test için zorlanabilir.
      const bilgi = gl.getExtension("WEBGL_debug_renderer_info");
      const cizici = bilgi ? String(gl.getParameter(bilgi.UNMASKED_RENDERER_WEBGL)) : "";
      const yazilim = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(cizici);
      const zorla = new URLSearchParams(location.search).get("sahne") === "zorla";
      webglOnbellek = zorla || !yazilim;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webglOnbellek = false;
  }
  return webglOnbellek;
}
