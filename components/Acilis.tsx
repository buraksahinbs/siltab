"use client";

// Açılış: koyu stüdyo sahnesi. Kaydırma ilerlemesi sahneyi ve metinleri birlikte sürer.
// WebGL yoksa ya da azaltılmış hareket istenmişse düz görsel gösterilir.
// Ağır sahne (three.js) yalnızca gerektiğinde ve sonradan yüklenir: masaüstünde tarayıcı
// boşta kalınca, dokunmatik cihazlarda ilk etkileşimde.

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { acilis, kategoriAdlari } from "@/content/site";
import type { Urun } from "@/content/urunler";
import { useAzHareket, useMedya, useWebgl } from "@/lib/ortam";
import { cozumle, sahneDurumu } from "@/lib/sahne";

const UrunSahnesi = dynamic(() => import("./sahne/UrunSahnesi"), { ssr: false });

type Mod = "poster" | "3b" | "duz";

export default function Acilis({ urunler }: { urunler: Urun[] }) {
  const bolumRef = useRef<HTMLElement>(null);
  const azHareket = useAzHareket();
  const webgl = useWebgl();
  const buyukEkran = useMedya("(min-width: 1024px)", true);
  const [yukle, setYukle] = useState(false);
  const [hazir, setHazir] = useState(false);
  const duz = azHareket || !webgl;
  const mod: Mod = duz ? "duz" : hazir ? "3b" : "poster";
  const [aktif, setAktif] = useState(true);
  const [asama, setAsama] = useState(-1);
  const [renk, setRenk] = useState(0);

  const renkSayilari = useMemo(() => urunler.map((u) => u.gorseller.length), [urunler]);
  const kartlar = useMemo(
    () =>
      urunler.map((u) => ({
        id: u.id,
        dokular: u.gorseller.map((g) => (buyukEkran ? g.buyuk : g.kucuk)),
      })),
    [urunler, buyukEkran],
  );

  // ---------------- mod seçimi ve gecikmeli yükleme
  useEffect(() => {
    if (duz) return;
    const dokunmatik = window.matchMedia("(pointer: coarse)").matches;
    let bitti = false;
    const basla = () => {
      if (bitti) return;
      bitti = true;
      setYukle(true);
      kaldir();
    };
    const olaylar = ["pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
    const kaldir = () => olaylar.forEach((o) => window.removeEventListener(o, basla));
    olaylar.forEach((o) => window.addEventListener(o, basla, { passive: true, once: true }));
    let bosta: number | undefined;
    if (!dokunmatik) {
      const ric = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 600));
      bosta = ric(basla, { timeout: 2500 }) as number;
    }
    return () => {
      kaldir();
      if (bosta && window.cancelIdleCallback) window.cancelIdleCallback(bosta);
    };
  }, [duz]);

  const onHazir = useCallback(() => setHazir(true), []);

  // ---------------- kaydırma → sahne durumu
  useEffect(() => {
    const bolum = bolumRef.current;
    if (!bolum || mod === "duz") return;
    const tetik = ScrollTrigger.create({
      trigger: bolum,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        sahneDurumu.hedef = self.progress;
      },
    });
    sahneDurumu.hedef = tetik.progress;

    let sonAsama = -2;
    let sonRenk = -1;
    const tik = (_t: number, dtMs: number) => {
      const dt = Math.min(0.1, dtMs / 1000);
      const s = sahneDurumu;
      // ikinci sönüm katmanı: kaydırma dursa da sahne bir an süzülerek oturur
      s.deger += (s.hedef - s.deger) * (1 - Math.exp(-dt * 4.2));
      if (Math.abs(s.hedef - s.deger) < 1e-5) s.deger = s.hedef;
      const c = cozumle(s.deger, renkSayilari);
      if (c.ondeki !== sonAsama) {
        sonAsama = c.ondeki;
        setAsama(c.ondeki);
      }
      if (c.renk !== sonRenk) {
        sonRenk = c.renk;
        setRenk(c.renk);
      }
      bolum.style.setProperty("--giris", c.giris.toFixed(4));
    };
    gsap.ticker.add(tik);

    const gozlemci = new IntersectionObserver(([g]) => setAktif(g.isIntersecting), { threshold: 0 });
    gozlemci.observe(bolum);

    const imlec = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      sahneDurumu.imlecHedefX = (e.clientX / window.innerWidth) * 2 - 1;
      sahneDurumu.imlecHedefY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", imlec, { passive: true });

    return () => {
      tetik.kill();
      gsap.ticker.remove(tik);
      gozlemci.disconnect();
      window.removeEventListener("pointermove", imlec);
    };
  }, [mod, renkSayilari]);

  const urun = asama >= 0 ? urunler[asama] : null;
  const toplam = urunler.length;
  const iki = (n: number) => String(n).padStart(2, "0");

  const kategoriyeGit = () => {
    if (!urun) return;
    window.dispatchEvent(new CustomEvent("koleksiyon-kategori", { detail: urun.kategori }));
  };

  const ilk = urunler[0].gorseller[0];

  return (
    <section
      ref={bolumRef}
      id="acilis"
      data-tema="koyu"
      aria-label="Açılış"
      className={`bolum koyu-alan acilis-uzun relative ${mod === "duz" ? "acilis-duz" : ""}`}
      style={{ ["--asama-sayisi" as string]: toplam }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-koyu">
        {/* düz görsel: poster ve yedek */}
        <div
          aria-hidden={mod !== "duz"}
          className="acilis-poster pointer-events-none absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-sakin)]"
          style={{ opacity: hazir ? 0 : 1 }}
        >
          <div className="acilis-poster-isik absolute inset-0" />
          <div className="acilis-poster-kart absolute">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ilk.kucuk}
              srcSet={`${ilk.kucuk} 768w, ${ilk.buyuk} 1200w`}
              sizes="(min-width: 1024px) 40vw, 70vw"
              alt={`${kategoriAdlari[urunler[0].kategori]} kategorisinden bir model`}
              width={1200}
              height={1200}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {yukle && mod !== "duz" && (
          <div
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-sakin)]"
            style={{ opacity: hazir ? 1 : 0 }}
          >
            <UrunSahnesi kartlar={kartlar} onHazir={onHazir} aktif={aktif} />
          </div>
        )}

        {/* metin katmanı */}
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-[var(--kenar)] pb-[clamp(2rem,6vh,4.5rem)]">
          {/* açılış metni */}
          <div
            className="acilis-giris max-w-[36rem] lg:max-w-[40rem]"
            aria-hidden={asama >= 0}
            style={{
              opacity: asama >= 0 ? 0 : 1,
              transform: asama >= 0 ? "translate3d(0,-24px,0)" : "none",
              transition: "opacity .8s var(--ease-yumusak), transform 1s var(--ease-yumusak)",
            }}
          >
            <p className="ust-etiket acilis-satir text-taba" style={{ ["--satir" as string]: 0 }}>
              {acilis.ust}
            </p>
            <h1 className="baslik-dev mt-5 lg:mt-7">
              {acilis.baslik.map((s, i) => (
                <span key={s} className="satir-maske">
                  <span className="acilis-satir" style={{ ["--satir" as string]: i + 1 }}>
                    {i === 1 ? <em className="font-light italic">{s}</em> : s}
                  </span>
                </span>
              ))}
            </h1>
            <p
              className="govde-buyuk acilis-satir ikincil mt-6 max-w-[30rem] lg:mt-8"
              style={{ ["--satir" as string]: 3 }}
            >
              {acilis.metin}
            </p>
            {mod !== "duz" && (
              <div className="acilis-satir mt-8 flex items-center gap-4 lg:mt-12" style={{ ["--satir" as string]: 4 }}>
                <span className="acilis-ok relative block h-10 w-px overflow-hidden bg-[var(--cizgi)]" aria-hidden="true" />
                <span className="ust-etiket ikincil">{acilis.kaydir}</span>
              </div>
            )}
          </div>

          {/* aşama metni */}
          {mod !== "duz" && (
            <div
              className="absolute inset-x-[var(--kenar)] bottom-[clamp(2rem,6vh,4.5rem)]"
              aria-live="polite"
              style={{
                opacity: asama >= 0 ? 1 : 0,
                transition: "opacity .9s var(--ease-yumusak)",
              }}
            >
              {urun && (
                <div key={urun.id} className="acilis-asama max-w-[32rem]">
                  <p className="ust-etiket ikincil tabular-nums">
                    <span className="text-taba">{iki(asama + 1)}</span>
                    <span className="mx-2 opacity-50">/</span>
                    {iki(toplam)}
                  </p>
                  <h2 className="baslik-1 mt-4">{kategoriAdlari[urun.kategori]}</h2>
                  <div className="mt-6 flex items-center gap-5">
                    <ul className="flex items-center gap-2.5" aria-label="Renk seçenekleri">
                      {urun.gorseller.map((g, i) => (
                        <li
                          key={g.buyuk}
                          className="block h-2.5 w-2.5 rounded-full ring-1 ring-offset-2 ring-offset-koyu transition-[box-shadow,transform] duration-500"
                          style={{
                            background: g.renk,
                            boxShadow: i === renk ? "0 0 0 1px var(--color-krem)" : "0 0 0 1px rgba(246,242,236,.22)",
                            transform: i === renk ? "scale(1.15)" : "none",
                          }}
                        >
                          <span className="ekran-okuyucu">
                            Renk {i + 1}
                            {i === renk ? " (gösteriliyor)" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <span className="ust-etiket ikincil">{urun.gorseller.length} renk</span>
                  </div>
                  <button
                    type="button"
                    onClick={kategoriyeGit}
                    className="baglanti pointer-events-auto mt-8 inline-flex items-center gap-3 text-sm"
                  >
                    {kategoriAdlari[urun.kategori]} modellerini görün
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
