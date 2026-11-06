// Kurumsal: kısa tarihçe ve kaydırmayla ilerleyen zaman çizelgesi (sunucu bileşeni).
// Masaüstünde çizelge ekrana sabitlenir ve çizgi soldan sağa dolar; mobilde dikey akar.
// Yapışkan düzen CSS medya sorgularıyla kurulur; ilerlemeyi küçük bir istemci parçası sürer.

import Image from "next/image";
import { atmosfer } from "@/content/atmosfer";
import { kurumsal } from "@/content/site";
import CizelgeIzleyici from "./CizelgeIzleyici";

export default function Kurumsal() {
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
            <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 10" }} data-acil>
              <div className="absolute inset-x-0 -top-[10%] h-[120%]" data-paralaks="0.06">
                <div className="h-full w-full" data-acil-ic>
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
      <div id="zaman-cizelgesi" className="cizelge cizelge-pist relative" style={{ ["--ilerleme" as string]: 0 }}>
        <CizelgeIzleyici hedef="zaman-cizelgesi" adet={kurumsal.zaman.length} />
        <div className="cizelge-yapiskan">
          <div className="mx-auto w-full max-w-[1600px] px-[var(--kenar)]">
            <h3 className="ust-etiket ikincil">Zaman çizelgesi</h3>
            <ol className="cizelge-liste relative mt-12 lg:mt-20">
              <span className="cizelge-cizgi" aria-hidden="true">
                <span className="cizelge-dolu" />
              </span>
              {kurumsal.zaman.map((z, i) => (
                <li key={z.yil} data-sira={i} className="cizelge-oge">
                  <span className="cizelge-nokta" aria-hidden="true" />
                  <p className="cizelge-yil serif text-[clamp(2.75rem,4.6vw,4.75rem)] leading-none font-light tabular-nums">
                    {z.yil}
                  </p>
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
