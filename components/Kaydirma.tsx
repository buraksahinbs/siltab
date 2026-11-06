"use client";

// Sayfa geneli kaydırma: Lenis ile yumuşak kaydırma, GSAP ScrollTrigger ile eşleme,
// bölüm temaları (koyu/açık geçişi), görünme animasyonları, paralaks ve ilerleme çubuğu.
// prefers-reduced-motion açıkken Lenis ve paralaks kapanır, içerik doğrudan görünür.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

type KaydirmaApi = {
  /** id'ye ya da y konumuna yumuşak kaydır */
  git: (hedef: string | number, secenek?: { ani?: boolean }) => void;
  durdur: () => void;
  surdur: () => void;
};

const Baglam = createContext<KaydirmaApi>({ git: () => {}, durdur: () => {}, surdur: () => {} });
export const useKaydirma = () => useContext(Baglam);

export default function Kaydirma({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const cubukRef = useRef<HTMLDivElement>(null);
  const [api] = useState<KaydirmaApi>(() => ({
    git: (hedef, secenek) => {
      const el = typeof hedef === "string" ? document.getElementById(hedef) : null;
      const y = typeof hedef === "number" ? hedef : el ? el.getBoundingClientRect().top + window.scrollY : 0;
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(y, { duration: secenek?.ani ? 0 : 1.6, immediate: !!secenek?.ani, force: true });
      else window.scrollTo({ top: y, behavior: "auto" });
    },
    durdur: () => lenisRef.current?.stop(),
    surdur: () => lenisRef.current?.start(),
  }));

  useEffect(() => {
    const kok = document.documentElement;
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const temizlik: (() => void)[] = [];

    // ---------------- Lenis
    if (!azHareket) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tik = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tik);
      gsap.ticker.lagSmoothing(0);
      temizlik.push(() => {
        gsap.ticker.remove(tik);
        lenis.destroy();
        lenisRef.current = null;
      });
    }

    // ---------------- sayfa içi bağlantılar
    const tikla = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      api.git(id);
      history.replaceState(null, "", `#${id}`);
      // klavye kullanıcıları için odak hedefe geçsin
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", tikla);
    temizlik.push(() => document.removeEventListener("click", tikla));

    const ctx = gsap.context(() => {
      // ---------------- tema: bölüm ekranın ortasına geldiğinde html temasını değiştir
      document.querySelectorAll<HTMLElement>(".bolum[data-tema]").forEach((b) => {
        ScrollTrigger.create({
          trigger: b,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) kok.dataset.tema = b.dataset.tema;
          },
        });
      });

      // ---------------- ilerleme çubuğu
      if (cubukRef.current) {
        gsap.fromTo(
          cubukRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
          },
        );
      }

      if (!azHareket) {
        // ---------------- paralaks: data-paralaks="0.12" (oran, çerçeve yüksekliğine göre)
        document.querySelectorAll<HTMLElement>("[data-paralaks]").forEach((el) => {
          const oran = parseFloat(el.dataset.paralaks || "0.1");
          gsap.fromTo(
            el,
            { yPercent: -oran * 100 },
            {
              yPercent: oran * 100,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }
    });
    temizlik.push(() => ctx.revert());

    // ---------------- görünme
    const gozlemci = new IntersectionObserver(
      (girdiler) => {
        girdiler.forEach((g) => {
          if (g.isIntersecting) {
            g.target.classList.add("gorundu");
            gozlemci.unobserve(g.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    document.querySelectorAll("[data-gorun], [data-gorun-satir]").forEach((el) => gozlemci.observe(el));
    temizlik.push(() => gozlemci.disconnect());

    // yazı tipleri ve görseller yüklenince ölçüleri tazele
    const tazele = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(tazele);
    window.addEventListener("load", tazele);
    temizlik.push(() => window.removeEventListener("load", tazele));

    // adresle gelindiyse hedefe git
    if (location.hash.length > 1) {
      const id = decodeURIComponent(location.hash.slice(1));
      requestAnimationFrame(() => api.git(id, { ani: true }));
    }

    return () => temizlik.forEach((f) => f());
  }, [api]);

  return (
    <Baglam.Provider value={api}>
      <div
        ref={cubukRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-taba"
        style={{ transform: "scaleX(0)" }}
      />
      {children}
    </Baglam.Provider>
  );
}
