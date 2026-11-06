"use client";

// Açılış sahnesinin temel katmanı: WebGL gerektirmeyen, CSS 3B dönüşümleriyle kurulmuş
// stüdyo. Her ortamda (GPU'suz makine, ilk açılışta mobil, sahne yüklenmeden önce) çalışır
// ve kaydırmayla aynı hareketi verir: ürün zeminde döner, renk yüzleri değişir, ürünler
// sırayla gelir, kamera süzülür. Ürünler saydam kesittir; çevrelerinde zemin yoktur.
// Zeminde temas gölgesi ve ince yansıma vardır.
// Donanım hızlandırmalı WebGL katmanı hazır olunca bu katman söner ve döngüsü durur.
//
// Performans: DOM'a yalnızca ulaşılan ürün ve bir sonrakisi eklenir (ilk açılışta tek ürün);
// kare döngüsü değer değişmediğinde hiçbir şey yazmaz, ölçüler ResizeObserver ile tutulur.

import { useEffect, useRef, useState } from "react";
import type { Urun } from "@/content/urunler";
import { cozumle, onYuzRengi, sahneDurumu, sahneYerlesimi } from "@/lib/sahne";

const yumusakAdim = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// kesit boyutu tarayıcı tarafından seçilir: dikey ekranda kutu 82vw, yatayda 66svh
const KESIT_SIZES = "(max-aspect-ratio: 21/20) 82vw, 66svh";

// Ürün yüzeyinde kaydırmayla gezen yansıma bandı: ürünün kendi saydamlığıyla maskelenir,
// böylece yalnızca ürünün üstünde görünür (çevresinde dikdörtgen oluşmaz).
function Bant({ g }: { g: Urun["gorseller"][number] }) {
  const url = `url(${g.alfa.replace(".webp", "-768.webp")})`;
  return <span className="sahne-bant" style={{ WebkitMaskImage: url, maskImage: url }} />;
}

function Kesit({ g, sinif, oncelik }: { g: Urun["gorseller"][number]; sinif?: string; oncelik?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={sinif}
      src={g.alfaKucuk}
      srcSet={`${g.alfaKucuk} 512w, ${g.alfa.replace(".webp", "-768.webp")} 768w, ${g.alfa} 1024w`}
      sizes={KESIT_SIZES}
      alt=""
      width={1024}
      height={1024}
      decoding="async"
      fetchPriority={oncelik ? "high" : "auto"}
      draggable={false}
    />
  );
}

export default function CssSahne({
  urunler,
  calis,
}: {
  urunler: Urun[];
  /** false iken kare döngüsü durur (WebGL katmanı devraldığında ya da ekran dışında) */
  calis: boolean;
}) {
  const kokRef = useRef<HTMLDivElement>(null);
  // DOM'daki son ürün sırası: ilk açılışta yalnızca ilk ürün, kaydırma başlayınca bir sonraki
  const [son, setSon] = useState(0);
  // ilk açılışta yalnızca ilk ürünün ön yüz görseli; diğer renk yüzleri kaydırma başlayınca
  const [tumu, setTumu] = useState(false);

  useEffect(() => {
    const kok = kokRef.current;
    if (!kok || !calis) return;
    const kamera = kok.querySelector<HTMLElement>(".sahne-kamera")!;
    const yerler = Array.from(kok.querySelectorAll<HTMLElement>(".sahne-yer"));
    const urunElleri = yerler.map((y) => y.querySelector<HTMLElement>(".sahne-urun")!);
    const renkSayilari = urunler.map((u) => u.gorseller.length);
    let w = kok.clientWidth;
    let h = kok.clientHeight;
    let boyutDegisti = true;
    const ro = new ResizeObserver(() => {
      w = kok.clientWidth;
      h = kok.clientHeight;
      boyutDegisti = true;
    });
    ro.observe(kok);

    let kare = 0;
    let sonAnahtar = "";
    let sonOndeki = -2;
    const parlama = kok.querySelector<HTMLElement>(".sahne-parlama")!;
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ciz = () => {
      kare = requestAnimationFrame(ciz);
      const s = sahneDurumu;
      const anahtar = `${s.deger.toFixed(5)}|${s.imlecX.toFixed(3)}|${s.imlecY.toFixed(3)}`;
      if (anahtar === sonAnahtar && !boyutDegisti) return; // değişiklik yok: yazma
      sonAnahtar = anahtar;

      const y = sahneYerlesimi(w, h, s.deger);
      const c = cozumle(s.deger, renkSayilari);

      // ulaşılan ürün ve (kaydırma başladıysa) bir sonrakisi DOM'da olsun
      const gerekli = Math.min(urunler.length - 1, Math.round(c.odak) + (s.deger > 0.002 ? 1 : 0));
      if (gerekli > son) setSon(gerekli);
      if (!tumu && s.deger > 0.002) setTumu(true);

      if (boyutDegisti) {
        boyutDegisti = false;
        kok.style.setProperty("--k", `${y.kutu}px`);
        kok.style.setProperty("--mx", `${y.merkezX}px`);
        kok.style.setProperty("--zy", `${y.zeminY}px`);
        kamera.style.perspectiveOrigin = `${y.merkezX}px ${y.zeminY - y.kutu * 0.45}px`;
        kamera.style.transformOrigin = `${y.merkezX}px ${y.zeminY - y.kutu * 0.4}px`;
      }
      // spot huzmeleri: kaynaklar üstte, ürünün ortasına yönelir; kaydırmayla açı birkaç derece kayar
      const hedefX = y.merkezX;
      const hedefY = y.zeminY - y.kutu * 0.32;
      const kay = Math.sin(s.deger * Math.PI * 1.5) * 3.2; // derece
      const huzme = (n: number, kx: number) => {
        const sx = y.merkezX + kx * y.kutu + Math.sin(s.deger * Math.PI * 2) * y.kutu * 0.05;
        const aci = (-Math.atan2(hedefX - sx, hedefY + h * 0.08) * 180) / Math.PI + kay * (n === 1 ? 1 : -0.7);
        kok.style.setProperty(`--h${n}x`, `${sx.toFixed(1)}px`);
        kok.style.setProperty(`--h${n}a`, `${aci.toFixed(2)}deg`);
      };
      huzme(1, -0.42);
      huzme(2, 0.3);
      // ürün değişince kısa parlama (yaklaşık 0,6 sn)
      if (c.ondeki !== sonOndeki) {
        if (sonOndeki !== -2 && !azHareket) {
          parlama.animate([{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }], {
            duration: 650,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          });
        }
        sonOndeki = c.ondeki;
      }
      kamera.style.transform = `translate3d(${(-y.kameraX - s.imlecX * 10).toFixed(1)}px, ${(y.kameraY - s.imlecY * 6).toFixed(1)}px, 0) scale(${y.yaklasma.toFixed(4)})`;

      for (let i = 0; i < yerler.length; i++) {
        const el = yerler[i];
        const d = i - c.odak;
        const ad = Math.abs(d);
        const x = Math.sign(d) * Math.min(ad, 2.4) * y.kutu * 1.12 * (1 - Math.min(ad, 1) * 0.1);
        const z = -Math.pow(Math.min(ad, 2.4), 0.9) * y.kutu * 1.05;
        const yelpaze = -Math.sign(d) * Math.min(ad, 1.2) * 0.5;
        const girisDonus = c.asama === -1 && i === 0 ? -0.45 * (1 - c.giris) : 0;
        const odakta = 1 - Math.min(1, ad);
        const donus = c.donusler[i] + yelpaze + girisDonus + s.imlecX * 0.1 * odakta;

        const parlak = 1 - Math.min(ad, 1.5) * 0.5;
        // dinlenmede yalnızca odaktaki ürün görünür; komşular yalnızca geçişte belirir
        const sonma = Math.min(1, Math.max(0, ad - (d < 0 ? 0.4 : 0.5)) / 0.45);
        const opak = 1 - sonma;
        const cs = Math.abs(Math.cos(donus));
        // yan durumdan geçerken incelme görünmesin: yumuşakça sön
        const gorunum = yumusakAdim(0.12, 0.42, cs);

        el.style.visibility = opak > 0.002 ? "visible" : "hidden";
        el.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px)`;
        el.style.setProperty("--parlak", parlak.toFixed(3));
        el.style.setProperty("--opak", (opak * gorunum).toFixed(3));
        el.style.setProperty("--golge", (opak * (1 - Math.min(ad, 1) * 0.4)).toFixed(3));
        urunElleri[i].style.transform = `rotateY(${donus.toFixed(4)}rad)`;

        const sira = onYuzRengi(c.donusler[i], renkSayilari[i]);
        const gIdx = Math.cos(donus) >= 0 ? sira : 1 % renkSayilari[i];
        const gen = urunler[i].gorseller[gIdx]?.genislik ?? 0.85;
        el.style.setProperty("--gen", (gen * (0.45 + 0.55 * cs) + 0.12).toFixed(3));
        const on = String(sira);
        if (el.dataset.on !== on) el.dataset.on = on;
        // yansıma bandı: kaydırmayla ve dönüşle ürünün üzerinde gezer
        const bant = (((s.deger * 6 + c.donusler[i] / (Math.PI * 2)) % 1) + 1) % 1;
        el.style.setProperty("--bant", `${(bant * 100).toFixed(1)}%`);
      }
    };
    kare = requestAnimationFrame(ciz);
    return () => {
      cancelAnimationFrame(kare);
      ro.disconnect();
    };
  }, [calis, urunler, son, tumu]);

  return (
    <div ref={kokRef} className="sahne-css" aria-hidden="true">
      <div className="sahne-isik" />
      {/* spot ışıkları: iki yumuşak huzme, ürün arkasında sıcak hale, zeminde ışık havuzu */}
      <div className="sahne-huzme sahne-huzme-1" />
      <div className="sahne-huzme sahne-huzme-2" />
      <div className="sahne-hale" />
      <div className="sahne-havuz" />
      <div className="sahne-kamera">
        {urunler.slice(0, son + 1).map((u, i) => {
          const n = u.gorseller.length;
          const onlar = n >= 3 && tumu ? [0, 2] : [0];
          const arka = u.gorseller[1 % n];
          return (
            <div key={u.id} className="sahne-yer" data-on="0">
              <span className="sahne-golge" />
              <div className="sahne-urun">
                <div className="sahne-yuz">
                  {onlar.map((r) => (
                    <div key={r} className="sahne-renk" data-renk={r}>
                      <Kesit g={u.gorseller[r]} sinif="sahne-ana" oncelik={i === 0 && r === 0} />
                      <Bant g={u.gorseller[r]} />
                      <Kesit g={u.gorseller[r]} sinif="sahne-yansima" />
                    </div>
                  ))}
                </div>
                <div className="sahne-yuz sahne-arka">
                  {(tumu || i > 0) && (
                    <div className="sahne-renk">
                      <Kesit g={arka} sinif="sahne-ana" />
                      <Bant g={arka} />
                      <Kesit g={arka} sinif="sahne-yansima" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* ürün değişince spotun yeni ürüne dönüşü: kısa parlama */}
      <div className="sahne-parlama" />
      <div className="sahne-toz">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>
    </div>
  );
}
