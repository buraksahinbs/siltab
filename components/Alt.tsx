"use client";

import { altBilgi, bayiGirisi, firma, gezinme, tamirTakip } from "@/content/site";
import { pencereAc, Wordmark } from "./Ust";

export default function Alt() {
  return (
    <footer data-tema="koyu" className="bolum relative">
      <div className="mx-auto max-w-[1600px] px-[var(--kenar)] pb-10">
        <div className="ince-cizgi" />
        <div className="grid gap-12 pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark />
            <p className="mt-6 max-w-[18rem] text-sm leading-relaxed ikincil">{firma.sehir}</p>
          </div>
          <nav aria-label="Alt menü" className="lg:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {gezinme.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`} className="baglanti">
                    {g.ad}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" className="baglanti" onClick={() => pencereAc("tamir")}>
                  {tamirTakip.baslik}
                </button>
              </li>
              <li>
                <button type="button" className="baglanti" onClick={() => pencereAc("bayi")}>
                  {bayiGirisi.baslik}
                </button>
              </li>
            </ul>
          </nav>
          <div className="text-sm lg:col-span-4 lg:text-right">
            <a href={firma.telefonHref} className="baglanti tabular-nums">
              {firma.telefon}
            </a>
            <br />
            <a href={`mailto:${firma.eposta}`} className="baglanti mt-2 inline-block">
              {firma.eposta}
            </a>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 text-xs ikincil sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {altBilgi.telif}
          </p>
          <p>{altBilgi.temsili}</p>
        </div>
      </div>
    </footer>
  );
}
