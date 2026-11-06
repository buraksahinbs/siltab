"use client";

// Açılış: koyu stüdyo sahnesi, kaydırmayla ekrana sabitlenir (sticky). Kaydırma ilerlemesi
// sahneyi ve metinleri birlikte sürer: ürün zeminde döner, renk yüzleri değişir, ürünler
// sırayla gelir, kamera süzülür, başlık değişir.
// Temel katman CSS 3B sahnesidir (her ortamda çalışır). Donanım hızlandırmalı WebGL varsa
// three.js katmanı sonradan yüklenip üstüne gelir: masaüstünde tarayıcı boşta kalınca,
// dokunmatik cihazlarda ilk etkileşimde. Azaltılmış harekette sahne sabit durur.

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { acilis, kategoriAdlari } from "@/content/site";
import type { Urun } from "@/content/urunler";
import { izle, yapiskanAralik } from "@/lib/izle";
import { useAzHareket, useMedya, webglVar } from "@/lib/ortam";
import { cozumle, sahneDurumu } from "@/lib/sahne";
import CssSahne from "./sahne/CssSahne";

const UrunSahnesi = dynamic(() => import("./sahne/UrunSahnesi"), { ssr: false });

type Mod = "css" | "3b" | "duz";

export default function Acilis({ urunler }: { urunler: Urun[] }) {
  const bolumRef = useRef<HTMLElement>(null);
  const azHareket = useAzHareket();
  const buyukEkran = useMedya("(min-width: 1024px)", true);
  const [yukle, setYukle] = useState(false);
  const [hazir, setHazir] = useState(false);
  // WebGL denetimi (GL bağlamı açar) hidrasyonda değil, sahne yüklenmeden hemen önce yapılır.
  // Donanım hızlandırması yoksa CSS sahnesi kalır (sayfa düzeni değişmez).
  const duz = azHareket;
  const mod: Mod = duz ? "duz" : hazir ? "3b" : "css";
  const [aktif, setAktif] = useState(true);
  const [asama, setAsama] = useState(-1);
  const [renk, setRenk] = useState(0);

  const renkSayilari = useMemo(() => urunler.map((u) => u.gorseller.length), [urunler]);
  const kartlar = useMemo(
    () =>
      urunler.map((u) => ({
        id: u.id,
        dokular: u.gorseller.map((g) => (buyukEkran ? g.alfa : g.alfaKucuk)),
        genislikler: u.gorseller.map((g) => g.genislik),
      })),
    [urunler, buyukEkran],
  );

  // ---------------- mod seçimi ve gecikmeli yükleme
  useEffect(() => {
    if (duz) return;
    // dokunmatik ya da dar ekran: sahne yalnızca ilk etkileşimde yüklenir (mobil işlemciyi ilk açılışta yorma)
    const dokunmatik = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024;
    let bitti = false;
    const basla = () => {
      if (bitti) return;
      bitti = true;
      kaldir();
      if (webglVar()) setYukle(true);
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
    if (!bolum || duz) return;
    const birak = izle(bolum, yapiskanAralik, (p) => {
      sahneDurumu.hedef = p;
    });

    let sonAsama = -2;
    let sonRenk = -1;
    let gorunur = true;
    let onceki = performance.now();
    let kare = 0;
    const tik = (simdi: number) => {
      kare = requestAnimationFrame(tik);
      // yavaş cihazda da sahne kaydırmanın gerisinde kalmasın: kare süresi 0,25 sn ile sınırlı
      const dt = Math.min(0.25, (simdi - onceki) / 1000);
      onceki = simdi;
      if (!gorunur) return;
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

    };
    kare = requestAnimationFrame(tik);

    const gozlemci = new IntersectionObserver(
      ([g]) => {
        gorunur = g.isIntersecting;
        setAktif(g.isIntersecting);
      },
      { threshold: 0 },
    );
    gozlemci.observe(bolum);

    const imlec = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      sahneDurumu.imlecHedefX = (e.clientX / window.innerWidth) * 2 - 1;
      sahneDurumu.imlecHedefY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", imlec, { passive: true });

    return () => {
      birak();
      cancelAnimationFrame(kare);
      gozlemci.disconnect();
      window.removeEventListener("pointermove", imlec);
    };
  }, [duz, renkSayilari]);

  const urun = asama >= 0 ? urunler[asama] : null;
  const toplam = urunler.length;
  const iki = (n: number) => String(n).padStart(2, "0");

  const kategoriyeGit = () => {
    if (!urun) return;
    window.dispatchEvent(new CustomEvent("koleksiyon-kategori", { detail: urun.kategori }));
  };

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
        {/* temel katman: CSS 3B sahnesi */}
        <div
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-sakin)]"
          style={{ opacity: hazir ? 0 : 1 }}
        >
          <CssSahne urunler={urunler} calis={!hazir && aktif} />
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
                  {urun.gorseller.length > 1 && (
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
                  )}
                  {urun.kategori !== "erkek-klasik" && (
                  <button
                    type="button"
                    onClick={kategoriyeGit}
                    className="baglanti pointer-events-auto mt-8 inline-flex items-center gap-3 text-sm"
                  >
                    {kategoriAdlari[urun.kategori]} modellerini görün
                    <span aria-hidden="true">→</span>
                  </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* sağdaki kategori göstergesi (masaüstü) */}
          {mod !== "duz" && (
            <ol
              aria-hidden="true"
              className="absolute right-[var(--kenar)] bottom-[clamp(2rem,6vh,4.5rem)] hidden flex-col items-end gap-2.5 lg:flex"
              style={{ opacity: asama >= 0 ? 1 : 0, transition: "opacity .8s var(--ease-yumusak)" }}
            >
              {urunler.map((u, i) => (
                <li key={u.id} className="flex items-center gap-3">
                  <span
                    className="ust-etiket transition-[opacity,color] duration-700"
                    style={{ opacity: i === asama ? 1 : 0.38, color: i === asama ? "var(--color-krem)" : undefined }}
                  >
                    {kategoriAdlari[u.kategori]}
                  </span>
                  <span
                    className="block h-px transition-[width,background-color] duration-700"
                    style={{
                      width: i === asama ? 28 : 10,
                      background: i === asama ? "var(--color-taba)" : "rgba(246,242,236,.3)",
                    }}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
