"use client";

// Üst menü: bölüm bağlantıları, tamir takip ve bayi girişi pencereleri, mobil menü.
// Aşağı kaydırınca gizlenir, yukarı kaydırınca geri gelir.

import { useCallback, useEffect, useRef, useState } from "react";
import { bayiGirisi, firma, gezinme, tamirTakip } from "@/content/site";
import { BayiGirisFormu, TamirTakipFormu } from "./Formlar";
import { useKaydirma } from "./Kaydirma";
import Modal from "./Modal";

type Pencere = null | "tamir" | "bayi";

export function pencereAc(p: Exclude<Pencere, null>) {
  window.dispatchEvent(new CustomEvent("pencere-ac", { detail: p }));
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2.5 leading-none ${className}`}>
      <span className="serif text-[1.65rem] font-medium tracking-[0.14em]">SİLTAB</span>
      <span className="text-[0.5625rem] font-medium tracking-[0.34em] opacity-70">GROUP</span>
    </span>
  );
}

export default function Ust() {
  const [pencere, setPencere] = useState<Pencere>(null);
  const [menu, setMenu] = useState(false);
  const [dolu, setDolu] = useState(false);
  const [gizli, setGizli] = useState(false);
  const sonY = useRef(0);
  const kaydirma = useKaydirma();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuDugmeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ac = (e: Event) => setPencere((e as CustomEvent<Pencere>).detail);
    window.addEventListener("pencere-ac", ac);
    return () => window.removeEventListener("pencere-ac", ac);
  }, []);

  useEffect(() => {
    const kaydir = () => {
      const y = window.scrollY;
      setDolu(y > 24);
      if (Math.abs(y - sonY.current) > 6) {
        setGizli(y > sonY.current && y > 240);
        sonY.current = y;
      }
    };
    kaydir();
    window.addEventListener("scroll", kaydir, { passive: true });
    return () => window.removeEventListener("scroll", kaydir);
  }, []);

  // mobil menü: kaydırmayı durdur, Esc ile kapat, odağı içeride tut
  useEffect(() => {
    if (!menu) return;
    const dugme = menuDugmeRef.current;
    kaydirma.durdur();
    document.body.style.overflow = "hidden";
    const ilk = menuRef.current?.querySelector<HTMLElement>("a, button");
    ilk?.focus();
    const tus = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if (e.key === "Tab" && menuRef.current) {
        const odaklar = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"));
        const bas = odaklar[0];
        const son = odaklar[odaklar.length - 1];
        if (e.shiftKey && document.activeElement === bas) {
          e.preventDefault();
          son.focus();
        } else if (!e.shiftKey && document.activeElement === son) {
          e.preventDefault();
          bas.focus();
        }
      }
    };
    window.addEventListener("keydown", tus);
    return () => {
      kaydirma.surdur();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", tus);
      dugme?.focus();
    };
  }, [menu, kaydirma]);

  const kapat = useCallback(() => setPencere(null), []);

  const menudenGit = (id: string) => {
    setMenu(false);
    requestAnimationFrame(() => kaydirma.git(id));
  };

  return (
    <>
      <a href="#icerik" className="icerige-gec">
        İçeriğe geç
      </a>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-yumusak)]"
        style={{
          transform: gizli && !menu ? "translate3d(0,-100%,0)" : "none",
          backgroundColor: dolu && !menu ? "var(--zemin)" : "transparent",
          borderBottom: `1px solid ${dolu && !menu ? "var(--cizgi)" : "transparent"}`,
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-[var(--kenar)] lg:h-[4.75rem]">
          <a href="#acilis" aria-label={`${firma.ad}, sayfa başı`} className="relative z-10">
            <Wordmark />
          </a>

          <nav aria-label="Ana menü" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {gezinme.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="baglanti text-[0.8125rem] tracking-[0.02em]">
                    {g.ad}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-7 lg:flex">
            <button
              type="button"
              onClick={() => setPencere("tamir")}
              className="ust-etiket ikincil transition-colors hover:text-[var(--yazi)]"
            >
              {tamirTakip.baslik}
            </button>
            <button type="button" onClick={() => setPencere("bayi")} className="dugme dugme-cizgi min-h-9 px-4">
              {bayiGirisi.baslik}
            </button>
          </div>

          <button
            ref={menuDugmeRef}
            type="button"
            className="relative z-10 -mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
            aria-expanded={menu}
            aria-controls="mobil-menu"
            onClick={() => setMenu((m) => !m)}
          >
            <span className="ust-etiket">{menu ? "Kapat" : "Menü"}</span>
            <span className="relative block h-2.5 w-6" aria-hidden="true">
              <span
                className="absolute left-0 h-px w-6 bg-current transition-transform duration-500"
                style={{ top: 0, transform: menu ? "translateY(5px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 h-px w-6 bg-current transition-transform duration-500"
                style={{ bottom: 0, transform: menu ? "translateY(-4px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* mobil menü */}
      <div
        id="mobil-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        hidden={!menu}
        className="koyu-alan fixed inset-0 z-40 overflow-y-auto bg-koyu px-[var(--kenar)] pt-24 pb-10 lg:hidden"
      >
        <nav aria-label="Mobil menü">
          <ul className="border-t border-[var(--cizgi)]">
            {gezinme.map((g, i) => (
              <li key={g.id} className="border-b border-[var(--cizgi)]">
                <a
                  href={`#${g.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    menudenGit(g.id);
                  }}
                  className="mobil-menu-oge flex items-baseline justify-between py-4"
                  style={{ ["--sira" as string]: i }}
                >
                  <span className="serif text-[2.1rem] leading-none font-light">{g.ad}</span>
                  <span className="ust-etiket ikincil tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 grid gap-4">
          <button
            type="button"
            className="dugme dugme-cizgi w-full"
            onClick={() => {
              setMenu(false);
              setPencere("bayi");
            }}
          >
            {bayiGirisi.baslik}
          </button>
          <button
            type="button"
            className="dugme w-full border border-[var(--cizgi)]"
            onClick={() => {
              setMenu(false);
              setPencere("tamir");
            }}
          >
            {tamirTakip.baslik}
          </button>
        </div>
        <div className="mt-10 text-sm ikincil">
          <a className="baglanti block w-fit" href={firma.telefonHref}>
            {firma.telefon}
          </a>
          <a className="baglanti mt-2 block w-fit" href={`mailto:${firma.eposta}`}>
            {firma.eposta}
          </a>
        </div>
      </div>

      <Modal acik={pencere === "tamir"} kapat={kapat} baslik={tamirTakip.baslik}>
        <TamirTakipFormu />
      </Modal>
      <Modal acik={pencere === "bayi"} kapat={kapat} baslik={bayiGirisi.baslik}>
        <BayiGirisFormu />
      </Modal>
    </>
  );
}
