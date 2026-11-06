"use client";

// Kurumsal: kısa tarihçe ve kaydırmayla ilerleyen zaman çizelgesi.
// Masaüstünde çizelge ekrana sabitlenir ve çizgi soldan sağa dolar; mobilde dikey akar.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { atmosfer } from "@/content/atmosfer";
import { kurumsal } from "@/content/site";
import { useAzHareket, useMedya } from "@/lib/ortam";

export default function Kurumsal() {
  const cizelgeRef = useRef<HTMLDivElement>(null);
  const masaustu = useMedya("(min-width: 1024px)");
  const hareket = !useAzHareket();
  const n = kurumsal.zaman.length;

  useEffect(() => {
    const el = cizelgeRef.current;
    if (!el) return;
    if (!hareket) {
      el.style.setProperty("--ilerleme", "1");
      return;
    }
    const tetik = ScrollTrigger.create({
      trigger: el,
      start: masaustu ? "top top" : "top 72%",
      end: masaustu ? "bottom bottom" : "bottom 60%",
      onUpdate: (self) => {
        // masaüstünde ilk ve son %8 boşta: çizelge oturur, sonra ilerler
        const p = masaustu ? gsap.utils.clamp(0, 1, (self.progress - 0.08) / 0.84) : self.progress;
        el.style.setProperty("--ilerleme", p.toFixed(4));
        el.querySelectorAll<HTMLElement>("[data-sira]").forEach((m) => {
          const i = Number(m.dataset.sira);
          m.classList.toggle("etkin", p >= i / (n - 1) - 0.02);
        });
      },
    });
    ScrollTrigger.refresh();
    return () => tetik.kill();
  }, [masaustu, hareket, n]);

  const atolye = atmosfer["x-taban-atolye"];
  const deri = atmosfer["x-deri-makro"];

  return (
    <section id="kurumsal" data-tema="koyu" aria-labelledby="kurumsal-baslik" className="bolum relative">
      <div className="mx-auto max-w-[1600px] px-[var(--kenar)] pt-[var(--ust-bosluk)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5" data-gorun>
            <p className="ust-etiket text-[var(--vurgu)]">{kurumsal.ust}</p>
            <h2 id="kurumsal-baslik" className="baslik-1 mt-6">
              {kurumsal.baslik}
            </h2>
            <div className="mt-8 grid max-w-[30rem] gap-5 text-[1.0625rem] leading-relaxed ikincil">
              {kurumsal.metin.map((m) => (
                <p key={m}>{m}</p>
              ))}
            </div>
          </div>
          <div className="relative lg:col-span-7 lg:pt-24" data-gorun style={{ ["--gecikme" as string]: "0.1s" }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
              <div className="absolute inset-x-0 -top-[10%] h-[120%]" data-paralaks="0.06">
                <Image
                  src={atolye.buyuk}
                  alt="Temsili görsel: ayakkabı kalıpları, tabanlar ve el aletleriyle atölye tezgâhı"
                  width={atolye.en}
                  height={atolye.boy}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  quality={80}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="relative -mt-16 ml-auto w-[48%] overflow-hidden border-[8px] border-koyu sm:-mt-24 lg:-mr-6 lg:w-[42%]" style={{ aspectRatio: "4 / 3" }}>
              <div className="absolute inset-x-0 -top-[12%] h-[124%]" data-paralaks="0.1">
                <Image
                  src={deri.kucuk}
                  alt="Temsili görsel: dikişli kahverengi derinin yakın çekimi"
                  width={800}
                  height={450}
                  sizes="(min-width: 1024px) 24vw, 48vw"
                  quality={80}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* zaman çizelgesi */}
      <div
        ref={cizelgeRef}
        className="cizelge relative"
        style={{ ["--ilerleme" as string]: 0, height: masaustu && hareket ? "240svh" : undefined }}
      >
        <div
          className={
            masaustu && hareket
              ? "sticky top-0 flex h-svh flex-col justify-center"
              : "py-[clamp(5rem,10vw,8rem)]"
          }
        >
          <div className="mx-auto w-full max-w-[1600px] px-[var(--kenar)]">
            <h3 className="ust-etiket ikincil">Zaman çizelgesi</h3>
            <ol className="cizelge-liste relative mt-12 lg:mt-20">
              <span className="cizelge-cizgi" aria-hidden="true">
                <span className="cizelge-dolu" />
              </span>
              {kurumsal.zaman.map((z, i) => (
                <li key={z.yil} data-sira={i} className="cizelge-oge">
                  <span className="cizelge-nokta" aria-hidden="true" />
                  <p className="serif text-[clamp(2.75rem,4.6vw,4.75rem)] leading-none font-light tabular-nums">{z.yil}</p>
                  <p className="ust-etiket mt-5 text-taba">{z.baslik}</p>
                  <p className="mt-3 max-w-[15rem] text-sm leading-relaxed ikincil">{z.metin}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
