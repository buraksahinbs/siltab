// Haberler: mevcut sitedeki iki haber. Editoryal satırlar, kart ızgarası değil.

import Image from "next/image";
import { haberler } from "@/content/site";

export default function Haberler() {
  return (
    <section id="haberler" data-tema="acik" aria-labelledby="haberler-baslik" className="bolum relative">
      <div className="mx-auto max-w-[1600px] px-[var(--kenar)] pb-[var(--ust-bosluk)]">
        <div className="ince-cizgi" />
        <div className="grid gap-10 pt-[clamp(4rem,8vw,7rem)] lg:grid-cols-12">
          <h2 id="haberler-baslik" className="ust-etiket text-[var(--vurgu)] lg:col-span-3" data-gorun>
            {haberler.ust}
          </h2>
          <ul className="grid gap-16 lg:col-span-9 lg:gap-20">
            {haberler.liste.map((h, i) => (
              <li
                key={h.baslik}
                className="grid items-center gap-8 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-10 lg:gap-14"
                data-gorun
                style={{ ["--gecikme" as string]: `${i * 0.08}s` }}
              >
                <div className={`relative aspect-[3/2] ${h.kesit ? "" : "overflow-hidden bg-krem-2"}`} data-acil={h.kesit ? undefined : ""}>
                  <div className="absolute inset-0" data-acil-ic>
                    <Image
                      src={h.gorsel}
                      alt={h.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 40vw, 100vw"
                      quality={80}
                      className={h.kesit ? "object-contain" : "object-cover"}
                    />
                  </div>
                </div>
                <div>
                  {h.tarih && <p className="ust-etiket ikincil">{h.tarih}</p>}
                  <h3 className="baslik-2 mt-4">{h.baslik}</h3>
                  <p className="mt-5 max-w-[32rem] text-[1.0625rem] leading-relaxed ikincil">{h.metin}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
