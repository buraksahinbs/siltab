// Markalar: Pierre Cardin, Kuum London, Step More. Koyu bölüm, editoryal iki sütun düzeni,
// görseller çerçeve içinde yavaş paralaksla kayar.

import Image from "next/image";
import type { ReactNode } from "react";
import { atmosfer } from "@/content/atmosfer";
import { markalar } from "@/content/site";

function Cerceve({
  src,
  en,
  boy,
  alt,
  oran,
  konum = "50% 50%",
  sizes,
}: {
  src: string;
  en: number;
  boy: number;
  alt: string;
  oran: string;
  konum?: string;
  sizes: string;
}) {
  return (
    <div className="relative overflow-hidden bg-koyu-2" style={{ aspectRatio: oran }}>
      <div className="absolute inset-x-0 -top-[10%] h-[120%]" data-paralaks="0.07">
        <Image
          src={src}
          alt={alt}
          width={en}
          height={boy}
          sizes={sizes}
          quality={80}
          className="h-full w-full object-cover"
          style={{ objectPosition: konum }}
        />
      </div>
    </div>
  );
}

function Blok({
  id,
  ters,
  gorsel,
  children,
}: {
  id: string;
  ters?: boolean;
  gorsel: ReactNode;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      className="grid items-center gap-12 lg:grid-cols-12 lg:gap-x-10"
      aria-labelledby={`${id}-baslik`}
    >
      <div
        className={`lg:col-span-5 ${ters ? "lg:order-2 lg:col-start-8" : "lg:col-start-1"}`}
        data-gorun
      >
        {children}
      </div>
      <div
        className={`${ters ? "lg:order-1 lg:col-span-6 lg:col-start-1" : "lg:col-span-6 lg:col-start-7"}`}
        data-gorun
        style={{ ["--gecikme" as string]: "0.12s" }}
      >
        {gorsel}
      </div>
    </article>
  );
}

export default function Markalar() {
  const pc = markalar.pierreCardin;
  const kuum = markalar.kuumLondon;
  const sm = markalar.stepMore;
  const kuumG = atmosfer["m-kuum-kadin"];
  const smG = atmosfer["m-topuklu-oturan"];

  return (
    <section id="markalar" data-tema="koyu" aria-labelledby="markalar-baslik" className="bolum relative">
      <div className="mx-auto max-w-[1600px] px-[var(--kenar)] pt-[var(--ust-bosluk)] pb-[var(--ust-bosluk)]">
        <header className="grid gap-6 lg:grid-cols-12" data-gorun>
          <p className="ust-etiket text-[var(--vurgu)] lg:col-span-3 lg:pt-4">{markalar.ust}</p>
          <h2 id="markalar-baslik" className="baslik-1 lg:col-span-9">
            {markalar.baslik}
          </h2>
        </header>

        <div className="mt-[clamp(4rem,9vw,8rem)] grid gap-[clamp(6rem,12vw,11rem)]">
          {/* Pierre Cardin */}
          <Blok
            id="pierre-cardin"
            gorsel={
              <div className="relative">
                <Cerceve
                  src="/mevcut/pierre-cardin-erkek.webp"
                  en={1200}
                  boy={801}
                  oran="5 / 4"
                  konum="40% 50%"
                  alt="Pierre Cardin kampanya fotoğrafı: siyah smokinli erkek, İstanbul vapuru önünde"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute -bottom-10 -left-6 hidden w-[34%] border-[10px] border-koyu bg-white lg:block xl:-left-14">
                  <Image
                    src="/mevcut/pierre-cardin-rugan.webp"
                    alt="Pierre Cardin siyah rugan erkek ayakkabı"
                    width={614}
                    height={568}
                    sizes="18vw"
                    quality={80}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            }
          >
            <h3 id="pierre-cardin-baslik" className="ekran-okuyucu">
              {pc.ad}
            </h3>
            <Image
              src="/marka/pierre-cardin-acik.png"
              alt="Pierre Cardin Paris"
              width={1324}
              height={304}
              className="h-auto w-[min(15rem,60vw)]"
              sizes="240px"
            />
            <p className="ust-etiket mt-10 text-taba">{pc.etiket}</p>
            <div className="mt-6 grid gap-4 text-[1.0625rem] leading-relaxed ikincil">
              {pc.metin.map((m) => (
                <p key={m}>{m}</p>
              ))}
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-[var(--cizgi)] pt-8">
              {pc.bilgiler.map((b) => (
                <div key={b.etiket}>
                  <dt className="ekran-okuyucu">{b.etiket}</dt>
                  <dd>
                    <span className="serif block text-[2.4rem] leading-none font-light tabular-nums">{b.deger}</span>
                    <span className="mt-2 block text-[0.8125rem] ikincil">{b.etiket}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs ikincil">Pierre Cardin bilgileri markanın genelini anlatır.</p>
          </Blok>

          {/* Kuum London: kırmızı yalnızca burada ve küçük dozda */}
          <Blok
            id="kuum-london"
            ters
            gorsel={
              <Cerceve
                src={kuumG.buyuk}
                en={kuumG.en}
                boy={kuumG.boy}
                oran="4 / 5"
                konum="50% 30%"
                alt="Temsili görsel: Londra sokağında siyah paltolu, kırmızı atkılı kadın"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            }
          >
            <h3 id="kuum-london-baslik" className="ekran-okuyucu">
              {kuum.ad}
            </h3>
            <div className="inline-block bg-krem px-5 py-4">
              <Image
                src="/marka/kuum-london.png"
                alt="Kuum London"
                width={718}
                height={245}
                className="h-auto w-[min(9.5rem,45vw)]"
                sizes="152px"
              />
            </div>
            <p className="ust-etiket mt-10 flex items-center gap-4">
              <span className="block h-px w-8 bg-kuum" aria-hidden="true" />
              {kuum.etiket}
            </p>
            <div className="mt-6 grid gap-4 text-[1.0625rem] leading-relaxed ikincil">
              {kuum.metin.map((m) => (
                <p key={m}>{m}</p>
              ))}
            </div>
          </Blok>

          {/* Step More */}
          <Blok
            id="step-more"
            gorsel={
              <div className="lg:pl-[16%]">
                <Cerceve
                  src={smG.buyuk}
                  en={smG.en}
                  boy={smG.boy}
                  oran="4 / 5"
                  konum="50% 60%"
                  alt="Temsili görsel: taş merdivende oturan, bej topuklu ayakkabılı kadın"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
            }
          >
            <h3 id="step-more-baslik" className="serif text-[clamp(2.75rem,4.5vw,4rem)] leading-none font-light italic">
              {sm.ad}
            </h3>
            <p className="ust-etiket mt-10 text-taba">{sm.etiket}</p>
            <div className="mt-6 grid gap-4 text-[1.0625rem] leading-relaxed ikincil">
              {sm.metin.map((m) => (
                <p key={m}>{m}</p>
              ))}
            </div>
          </Blok>
        </div>
      </div>
    </section>
  );
}
