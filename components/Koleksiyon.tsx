"use client";

// Koleksiyon: kategori seçici ve kaydırmaya bağlı, yatay akan ürün şeridi.
// Şerit dikey kaydırmayla yana kayar; kartlar ekranın ortasından uzaklaştıkça hafifçe
// döner (kavisli bir raf gibi). Fareyle kartın üstünde gezinince kart eğilir, dokunmatikte
// dokunuşla. Azaltılmış harekette şerit yerel yatay kaydırmaya döner.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { kategoriAdlari, kategoriSirasi, koleksiyon } from "@/content/site";
import type { KategoriKimligi, Urun } from "@/content/urunler";
import { useAzHareket } from "@/lib/ortam";
import { useKaydirma } from "./Kaydirma";

const iki = (n: number) => String(n).padStart(2, "0");

function UrunKarti({ urun, sira }: { urun: Urun; sira: number }) {
  const [renk, setRenk] = useState(0);
  const kartRef = useRef<HTMLDivElement>(null);
  const ad = kategoriAdlari[urun.kategori];

  const egil = (e: RPointerEvent<HTMLDivElement>) => {
    const el = kartRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ex", (-y * 7).toFixed(2));
    el.style.setProperty("--ey", (x * 9).toFixed(2));
    el.style.setProperty("--ix", `${(x * 100 + 50).toFixed(1)}%`);
    el.style.setProperty("--iy", `${(y * 100 + 50).toFixed(1)}%`);
  };
  const birak = () => {
    const el = kartRef.current;
    if (!el) return;
    el.style.setProperty("--ex", "0");
    el.style.setProperty("--ey", "0");
  };

  return (
    <li className="kart-yuva shrink-0" data-kategori={urun.kategori}>
      <div
        ref={kartRef}
        className="kart"
        onPointerMove={egil}
        onPointerDown={egil}
        onPointerLeave={birak}
        onPointerUp={(e) => e.pointerType !== "mouse" && birak()}
        onPointerCancel={birak}
      >
        <div className="kart-gorsel relative aspect-square overflow-hidden bg-white">
          {urun.gorseller.map((g, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={g.buyuk}
              src={g.kucuk}
              srcSet={`${g.kucuk} 768w, ${g.buyuk} 1200w`}
              sizes="(min-width: 1024px) 26vw, 70vw"
              alt={i === renk ? `${ad} modeli, ${i + 1}. renk seçeneği` : ""}
              aria-hidden={i !== renk}
              width={1200}
              height={1200}
              loading="lazy"
              decoding="async"
              className="kart-resim absolute inset-0 h-full w-full object-cover"
              style={{ opacity: i === renk ? 1 : 0 }}
            />
          ))}
          <span className="kart-isik" aria-hidden="true" />
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="ust-etiket">
            <span className="ikincil tabular-nums">{iki(sira)}</span>
            <span className="ml-3">{ad}</span>
          </p>
          <div className="flex items-center gap-1" role="group" aria-label={`${ad} renk seçenekleri`}>
            {urun.gorseller.map((g, i) => (
              <button
                key={g.buyuk}
                type="button"
                onClick={() => setRenk(i)}
                onMouseEnter={() => setRenk(i)}
                aria-label={`${i + 1}. renk`}
                aria-pressed={i === renk}
                className="flex h-7 w-7 items-center justify-center"
              >
                <span
                  className="block h-2.5 w-2.5 rounded-full transition-[box-shadow] duration-300"
                  style={{
                    background: g.renk,
                    boxShadow:
                      i === renk
                        ? "0 0 0 2px var(--color-krem), 0 0 0 3px var(--color-koyu)"
                        : "0 0 0 1px rgba(14,21,18,.18)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Koleksiyon({ urunler }: { urunler: Urun[] }) {
  const pistRef = useRef<HTMLDivElement>(null);
  const izRef = useRef<HTMLUListElement>(null);
  const cizgiRef = useRef<HTMLDivElement>(null);
  const yapiskan = !useAzHareket();
  const [yukseklik, setYukseklik] = useState<number | null>(null);
  const [aktif, setAktif] = useState<KategoriKimligi>(kategoriSirasi[0]);
  const tasma = useRef(0);
  const kaydirma = useKaydirma();

  const gruplar = kategoriSirasi
    .map((k) => ({ kategori: k, urunler: urunler.filter((u) => u.kategori === k) }))
    .filter((g) => g.urunler.length > 0);

  // ölç: şeridin taşan genişliği kadar dikey kaydırma payı
  useEffect(() => {
    if (!yapiskan) return;
    const iz = izRef.current;
    if (!iz) return;
    const olc = () => {
      tasma.current = Math.max(0, iz.scrollWidth - window.innerWidth);
      setYukseklik(window.innerHeight + tasma.current);
    };
    olc();
    const ro = new ResizeObserver(olc);
    ro.observe(iz);
    window.addEventListener("resize", olc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", olc);
    };
  }, [yapiskan]);

  useEffect(() => {
    if (yukseklik != null) ScrollTrigger.refresh();
  }, [yukseklik]);

  // kaydırma → yatay konum, kart eğimi, etkin kategori
  useEffect(() => {
    if (!yapiskan || yukseklik == null) return;
    const pist = pistRef.current!;
    const iz = izRef.current!;
    const xAyarla = gsap.quickSetter(iz, "x", "px");
    const kartlar = Array.from(iz.querySelectorAll<HTMLElement>(".kart-yuva, .grup-baslik"));
    const basliklar = Array.from(iz.querySelectorAll<HTMLElement>(".grup-baslik"));
    let sonAktif = "";

    const guncelle = (p: number) => {
      const x = -p * tasma.current;
      xAyarla(x);
      if (cizgiRef.current) cizgiRef.current.style.transform = `scaleX(${p})`;
      const vw = window.innerWidth;
      for (const el of kartlar) {
        const merkez = el.offsetLeft + x + el.offsetWidth / 2;
        const r = Math.max(-1.6, Math.min(1.6, (merkez - vw / 2) / (vw / 2)));
        el.style.setProperty("--egim", (-r * 9).toFixed(2));
        el.style.setProperty("--derin", (-Math.abs(r) * 50).toFixed(1));
      }
      // ekranın sol üçte birini geçen son grup etkin
      let etkin = basliklar[0]?.dataset.kategori ?? "";
      for (const b of basliklar) if (b.offsetLeft + x < vw * 0.4) etkin = b.dataset.kategori!;
      if (etkin !== sonAktif) {
        sonAktif = etkin;
        setAktif(etkin as KategoriKimligi);
      }
    };

    const tetik = ScrollTrigger.create({
      trigger: pist,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => guncelle(self.progress),
      onRefresh: (self) => guncelle(self.progress),
    });
    guncelle(tetik.progress);
    return () => tetik.kill();
  }, [yapiskan, yukseklik]);

  const kategoriyeGit = useCallback(
    (k: KategoriKimligi) => {
      const iz = izRef.current;
      const pist = pistRef.current;
      if (!iz || !pist) return;
      const baslik = iz.querySelector<HTMLElement>(`.grup-baslik[data-kategori="${k}"]`);
      if (!baslik) return;
      const solPay = parseFloat(getComputedStyle(iz).paddingLeft) || 0;
      const hedef = Math.max(0, baslik.offsetLeft - solPay);
      if (yapiskan && tasma.current > 0) {
        const pistUst = pist.getBoundingClientRect().top + window.scrollY;
        kaydirma.git(pistUst + Math.min(hedef, tasma.current));
      } else {
        iz.scrollTo({ left: hedef, behavior: "smooth" });
        setAktif(k);
      }
    },
    [yapiskan, kaydirma],
  );

  // açılış sahnesinden gelen "bu kategoriye git" isteği
  useEffect(() => {
    const dinle = (e: Event) => kategoriyeGit((e as CustomEvent<KategoriKimligi>).detail);
    window.addEventListener("koleksiyon-kategori", dinle);
    return () => window.removeEventListener("koleksiyon-kategori", dinle);
  }, [kategoriyeGit]);

  let sira = 0;

  return (
    <section id="koleksiyon" data-tema="acik" aria-labelledby="koleksiyon-baslik" className="bolum relative">
      <div className="mx-auto max-w-[1600px] px-[var(--kenar)] pt-[var(--ust-bosluk)]">
        <header className="grid gap-6 lg:grid-cols-12" data-gorun>
          <p className="ust-etiket text-[var(--vurgu)] lg:col-span-3 lg:pt-4">{koleksiyon.ust}</p>
          <div className="lg:col-span-9">
            <h2 id="koleksiyon-baslik" className="baslik-1">
              {koleksiyon.baslik}
            </h2>
            <p className="govde-buyuk ikincil mt-6 max-w-[34rem]">{koleksiyon.metin}</p>
          </div>
        </header>
      </div>

      <div
        ref={pistRef}
        className="relative"
        style={yapiskan && yukseklik != null ? { height: yukseklik } : undefined}
      >
        <div
          className={
            yapiskan
              ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden"
              : "pt-16 pb-24"
          }
        >
          {/* kategori seçici */}
          <nav
            aria-label="Kategoriler"
            className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-8 px-[var(--kenar)]"
          >
            <ul className="secici flex min-w-0 gap-x-7 gap-y-3 overflow-x-auto pb-1 lg:gap-x-10" data-lenis-prevent>
              {gruplar.map((g) => (
                <li key={g.kategori}>
                  <button
                    type="button"
                    onClick={() => kategoriyeGit(g.kategori)}
                    aria-current={aktif === g.kategori ? "true" : undefined}
                    className="secici-dugme relative py-2 text-[0.8125rem] whitespace-nowrap transition-colors duration-500"
                  >
                    {kategoriAdlari[g.kategori]}
                    <span className="ml-1.5 align-super text-[0.625rem] tabular-nums opacity-60">
                      {iki(g.urunler.length)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {yapiskan && (
              <p className="ust-etiket ikincil hidden shrink-0 pb-3 tabular-nums md:block" aria-hidden="true">
                <span className="text-[var(--yazi)]">{iki(gruplar.findIndex((g) => g.kategori === aktif) + 1)}</span>
                <span className="mx-2 opacity-50">/</span>
                {iki(gruplar.length)}
              </p>
            )}
          </nav>

          <ul
            ref={izRef}
            className={`iz flex items-end gap-[clamp(1.25rem,2.4vw,2.5rem)] px-[var(--kenar)] pt-[clamp(1.5rem,5vh,3.5rem)] ${
              yapiskan ? "w-max will-change-transform" : "snap-x snap-mandatory overflow-x-auto"
            }`}
          >
            {gruplar.map((g, gi) => (
              <Fragment key={g.kategori}>
                <li className="grup-baslik shrink-0 snap-start self-stretch" data-kategori={g.kategori}>
                  <div className="flex h-full flex-col justify-between border-l border-[var(--cizgi)] pl-5 lg:pl-7">
                    <span className="ust-etiket ikincil tabular-nums">{iki(gi + 1)}</span>
                    <div>
                      <h3 className="serif text-[clamp(2.4rem,4.4vw,4.25rem)] leading-none font-light italic">
                        {kategoriAdlari[g.kategori]}
                      </h3>
                      <p className="mt-4 text-sm ikincil">{g.urunler.length} model</p>
                    </div>
                  </div>
                </li>
                {g.urunler.map((u) => (
                  <UrunKarti key={u.id} urun={u} sira={++sira} />
                ))}
              </Fragment>
            ))}
            <li className="w-[var(--kenar)] shrink-0" aria-hidden="true" />
          </ul>

          {yapiskan && (
            <div className="mx-auto mt-[clamp(1.5rem,5vh,3rem)] w-full max-w-[1600px] px-[var(--kenar)]" aria-hidden="true">
              <div className="ince-cizgi relative overflow-hidden">
                <div ref={cizgiRef} className="absolute inset-0 origin-left bg-[var(--yazi)]" style={{ transform: "scaleX(0)" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
