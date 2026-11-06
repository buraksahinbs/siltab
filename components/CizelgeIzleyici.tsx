"use client";

// Zaman çizelgesinin kaydırma ilerlemesi: çizgiyi doldurur, geçilen yılları etkinleştirir.

import { useEffect } from "react";
import { izle } from "@/lib/izle";

export default function CizelgeIzleyici({ hedef, adet }: { hedef: string; adet: number }) {
  useEffect(() => {
    const el = document.getElementById(hedef);
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--ilerleme", "1");
      return;
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const ogeler = Array.from(el.querySelectorAll<HTMLElement>("[data-sira]"));
    const birak = izle(
      el,
      (o) =>
        mq.matches
          ? [o.ust, o.ust + o.yukseklik - o.vh]
          : [o.ust - o.vh * 0.72, o.ust + o.yukseklik - o.vh * 0.6],
      (ham) => {
        // masaüstünde ilk ve son %8 boşta: çizelge oturur, sonra ilerler
        const p = mq.matches ? Math.min(1, Math.max(0, (ham - 0.08) / 0.84)) : ham;
        el.style.setProperty("--ilerleme", p.toFixed(4));
        ogeler.forEach((m) => m.classList.toggle("etkin", p >= Number(m.dataset.sira) / (adet - 1) - 0.02));
      },
    );
    return birak;
  }, [hedef, adet]);
  return null;
}
