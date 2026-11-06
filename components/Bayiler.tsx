"use client";

// Bayi ağı: kaynak listeden hesaplanan sayılar (uydurma sayı yok), il seçimi ve arama.
// Liste (yaklaşık 100 KB) bölüm ekrana yaklaşınca ayrı parça olarak yüklenir.

import { useEffect, useMemo, useRef, useState } from "react";
import { bayiBolumu, firma } from "@/content/site";

export type Bayi = { il: string; bolge: string | null; ad: string; adres: string | null; telefon: string | null };

type Props = { bayiSayisi: number; ilSayisi: number; kibrisVar: boolean; iller: string[] };

const SAYFA = 10;

// Türkçe harfleri sadeleştirerek karşılaştır (ı/i, ş/s, ç/c, ğ/g, ö/o, ü/u, â/a)
function sadele(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function Sayac({ hedef, etiket, ek }: { hedef: number; etiket: string; ek?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let rafId = 0;
    const gozlemci = new IntersectionObserver(
      ([g]) => {
        if (!g.isIntersecting) return;
        gozlemci.disconnect();
        const basla = performance.now();
        const sure = 1800;
        const adim = (t: number) => {
          const p = Math.min(1, (t - basla) / sure);
          const e = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(hedef * e).toLocaleString("tr-TR");
          if (p < 1) rafId = requestAnimationFrame(adim);
        };
        el.textContent = "0";
        rafId = requestAnimationFrame(adim);
      },
      { threshold: 0.6 },
    );
    gozlemci.observe(el);
    return () => {
      gozlemci.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [hedef]);

  return (
    <div className="border-t border-[var(--cizgi)] pt-6">
      <dt className="ekran-okuyucu">{etiket}</dt>
      <dd>
        <span
          ref={ref}
          className="serif block text-[clamp(4rem,8.5vw,7.5rem)] leading-[0.9] font-light tabular-nums"
          aria-label={`${hedef} ${etiket}`}
        >
          {hedef.toLocaleString("tr-TR")}
        </span>
        <span className="mt-4 block text-sm ikincil">
          {etiket}
          {ek ? ` ${ek}` : ""}
        </span>
      </dd>
    </div>
  );
}

export default function Bayiler({ bayiSayisi, ilSayisi, kibrisVar, iller }: Props) {
  const bolumRef = useRef<HTMLElement>(null);
  const [liste, setListe] = useState<Bayi[] | null>(null);
  const [arama, setArama] = useState("");
  const [il, setIl] = useState("");
  const [adet, setAdet] = useState(SAYFA);

  // liste: bölüm yaklaşınca yükle
  useEffect(() => {
    const el = bolumRef.current;
    if (!el) return;
    let iptal = false;
    const yukle = () =>
      import("@/content/bayiler.json").then((m) => {
        if (!iptal) setListe(m.default as Bayi[]);
      });
    const g = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          g.disconnect();
          yukle();
        }
      },
      { rootMargin: "800px 0px" },
    );
    g.observe(el);
    return () => {
      iptal = true;
      g.disconnect();
    };
  }, []);

  const sonuc = useMemo(() => {
    if (!liste) return [];
    const q = sadele(arama);
    return liste.filter((b) => {
      if (il && b.il !== il) return false;
      if (!q) return true;
      return sadele(`${b.ad} ${b.adres ?? ""} ${b.il} ${b.bolge ?? ""}`).includes(q);
    });
  }, [liste, arama, il]);

  const gorunen = sonuc.slice(0, adet);

  return (
    <section ref={bolumRef} id="bayiler" data-tema="acik" aria-labelledby="bayiler-baslik" className="bolum relative">
      <div className="mx-auto max-w-[1600px] px-[var(--kenar)] pt-[var(--ust-bosluk)] pb-[clamp(5rem,10vw,9rem)]">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5">
            <div data-gorun>
              <p className="ust-etiket text-[var(--vurgu)]">{bayiBolumu.ust}</p>
              <h2 id="bayiler-baslik" className="baslik-1 mt-6">
                {bayiBolumu.baslik}
              </h2>
              <p className="govde-buyuk ikincil mt-6 max-w-[28rem]">{bayiBolumu.metin}</p>
            </div>
            <dl className="mt-14 grid grid-cols-2 gap-6" data-gorun>
              <Sayac hedef={bayiSayisi} etiket={bayiBolumu.bayiEtiketi} />
              <Sayac hedef={ilSayisi} etiket={bayiBolumu.ilEtiketi} ek={kibrisVar ? bayiBolumu.kibrisNotu : undefined} />
            </dl>
            <div className="mt-14 border-l border-[var(--vurgu)] pl-6" data-gorun>
              <p className="serif text-[1.75rem] leading-tight">{bayiBolumu.bayiOl.baslik}</p>
              <p className="mt-3 max-w-[24rem] text-sm leading-relaxed ikincil">{bayiBolumu.bayiOl.metin}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a href={firma.telefonHref} className="dugme dugme-dolu">
                  {firma.telefon}
                </a>
                <a href="#iletisim" className="baglanti text-sm">
                  İletişim formu
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:pl-[8%]" data-gorun style={{ ["--gecikme" as string]: "0.1s" }}>
            <div className="grid gap-6 sm:grid-cols-[1fr_14rem]">
              <div>
                <label htmlFor="bayi-ara" className="alan-etiket">
                  Ara
                </label>
                <input
                  id="bayi-ara"
                  type="search"
                  className="alan"
                  placeholder={bayiBolumu.aramaYer}
                  value={arama}
                  onChange={(e) => {
                    setArama(e.target.value);
                    setAdet(SAYFA);
                  }}
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="bayi-il" className="alan-etiket">
                  İl
                </label>
                <select id="bayi-il" className="alan" value={il} onChange={(e) => {
                    setIl(e.target.value);
                    setAdet(SAYFA);
                  }}>
                  <option value="">{bayiBolumu.tumIller}</option>
                  {iller.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="ust-etiket ikincil mt-10" aria-live="polite">
              {liste ? `${sonuc.length.toLocaleString("tr-TR")} bayi` : "Liste yükleniyor"}
            </p>

            <ul className="mt-4 border-t border-[var(--cizgi)]">
              {gorunen.map((b, i) => (
                <li
                  key={`${b.il}-${b.ad}-${i}`}
                  className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-[var(--cizgi)] py-5"
                >
                  <p className="text-[0.9375rem] font-medium tracking-[0.02em] uppercase" lang="tr">
                    {b.ad}
                  </p>
                  <p className="ust-etiket self-center text-right ikincil">
                    {b.il}
                    {b.bolge ? ` · ${b.bolge}` : ""}
                  </p>
                  <p className="text-sm ikincil">{b.adres ?? "Adres bilgisi yok"}</p>
                  {b.telefon ? (
                    <a
                      href={`tel:${b.telefon.replace(/\s/g, "")}`}
                      className="baglanti self-center justify-self-end text-sm whitespace-nowrap tabular-nums"
                    >
                      {b.telefon}
                    </a>
                  ) : (
                    <span />
                  )}
                </li>
              ))}
              {liste && sonuc.length === 0 && <li className="py-8 text-sm ikincil">{bayiBolumu.sonucYok}</li>}
              {!liste &&
                Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="border-b border-[var(--cizgi)] py-5" aria-hidden="true">
                    <span className="block h-4 w-40 bg-[var(--cizgi)]" />
                    <span className="mt-3 block h-3 w-64 max-w-full bg-[var(--cizgi)] opacity-60" />
                  </li>
                ))}
            </ul>

            {sonuc.length > adet && (
              <button type="button" className="dugme dugme-cizgi mt-8" onClick={() => setAdet((a) => a + SAYFA * 2)}>
                {bayiBolumu.dahaFazla}
                <span className="ikincil tabular-nums">({(sonuc.length - adet).toLocaleString("tr-TR")})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
