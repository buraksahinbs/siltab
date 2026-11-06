"use client";

// Sayfa geneli kaydırma: Lenis ile yumuşak kaydırma, bölüm temaları (koyu/açık geçişi),
// görünme animasyonları, paralaks ve ilerleme çubuğu. GSAP kullanılmaz: ilerlemeler
// lib/izle.ts ile hesaplanır (ilk yüklemede daha az JavaScript).
// prefers-reduced-motion açıkken Lenis ve paralaks kapanır, içerik doğrudan görünür.

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { izle } from "@/lib/izle";

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
        autoRaf: true,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
      });
      lenisRef.current = lenis;
      temizlik.push(() => {
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

    // ---------------- tema: bölüm ekranın %55 çizgisine geldiğinde html teması değişir
    document.querySelectorAll<HTMLElement>(".bolum[data-tema]").forEach((b) => {
      temizlik.push(
        izle(
          b,
          (o) => [o.ust - o.vh * 0.55, o.ust + o.yukseklik - o.vh * 0.55],
          (p) => {
            if (p > 0 && p < 1 && kok.dataset.tema !== b.dataset.tema) kok.dataset.tema = b.dataset.tema;
          },
        ),
      );
    });

    // ---------------- ilerleme çubuğu
    const cubuk = cubukRef.current;
    if (cubuk) {
      temizlik.push(
        izle(
          document.body,
          (o) => [0, Math.max(1, o.yukseklik - o.vh)],
          (p) => {
            cubuk.style.transform = `scaleX(${p.toFixed(4)})`;
          },
        ),
      );
    }

    // ---------------- paralaks: data-paralaks="0.07" (oran, öğe yüksekliğine göre)
    if (!azHareket) {
      document.querySelectorAll<HTMLElement>("[data-paralaks]").forEach((el) => {
        const oran = parseFloat(el.dataset.paralaks || "0.1");
        const ebeveyn = el.parentElement ?? el;
        el.style.willChange = "transform";
        temizlik.push(
          izle(
            ebeveyn,
            (o) => [o.ust - o.vh, o.ust + o.yukseklik],
            (p) => {
              el.style.transform = `translate3d(0, ${((p * 2 - 1) * oran * 100).toFixed(3)}%, 0)`;
            },
          ),
        );
      });
    }

    // ---------------- kaydırmaya bağlı girişler
    // data-gorun: blok, ekrana girerken kaydırmayla yükselir ve belirir (--g 0..1)
    // data-acil : görsel çerçevesi kaydırmayla kırpma maskesinden açılır, içi yakınlaşmadan oturur (--a 0..1)
    // Sayfa sonundaki öğeler de tamamlanabilsin diye aralık en fazla kaydırma değeriyle sınırlanır.
    const sinirla = (bas: number, son: number): [number, number] => {
      const enFazla = document.documentElement.scrollHeight - window.innerHeight;
      const s2 = Math.min(son, enFazla);
      return [Math.min(bas, s2 - 1), s2];
    };
    const yumusat = (x: number) => 1 - Math.pow(1 - x, 3);
    if (!azHareket) {
      document.querySelectorAll<HTMLElement>("[data-gorun]").forEach((el) => {
        temizlik.push(
          izle(
            el,
            (o) => sinirla(o.ust - o.vh * 0.98, o.ust - o.vh * 0.6),
            (p) => el.style.setProperty("--g", yumusat(p).toFixed(4)),
          ),
        );
      });
      document.querySelectorAll<HTMLElement>("[data-acil]").forEach((el) => {
        temizlik.push(
          izle(
            el,
            (o) => sinirla(o.ust - o.vh, o.ust - o.vh * 0.3),
            (p) => el.style.setProperty("--a", yumusat(p).toFixed(4)),
          ),
        );
      });
    }

    // ---------------- başlık satırları (zamana bağlı maske açılışı)
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
    document.querySelectorAll("[data-gorun-satir]").forEach((el) => gozlemci.observe(el));
    temizlik.push(() => gozlemci.disconnect());

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
