// İletişim: adres, telefon, e-posta, sosyal bağlantılar (sunucu) ve form arayüzü (istemci).

import { firma, iletisim } from "@/content/site";
import IletisimFormu from "./IletisimFormu";

export default function Iletisim() {
  return (
    <section id="iletisim" data-tema="koyu" aria-labelledby="iletisim-baslik" className="bolum relative">
      <div className="mx-auto max-w-[1600px] px-[var(--kenar)] pt-[var(--ust-bosluk)] pb-[clamp(5rem,10vw,8rem)]">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-5" data-gorun>
            <p className="ust-etiket text-[var(--vurgu)]">{iletisim.ust}</p>
            <h2 id="iletisim-baslik" className="baslik-1 mt-6">
              {iletisim.baslik}
            </h2>

            <dl className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <dt className="ust-etiket ikincil">Adres</dt>
                <dd className="mt-4">
                  <address className="text-[1.0625rem] leading-relaxed not-italic">
                    {firma.adresSatirlari.map((s) => (
                      <span key={s} className="block">
                        {s}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              <div>
                <dt className="ust-etiket ikincil">Telefon</dt>
                <dd className="mt-4">
                  <a href={firma.telefonHref} className="baglanti serif text-[1.75rem] leading-none tabular-nums">
                    {firma.telefon}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="ust-etiket ikincil">E-posta</dt>
                <dd className="mt-4">
                  <a href={`mailto:${firma.eposta}`} className="baglanti serif text-[1.75rem] leading-none">
                    {firma.eposta}
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <dt className="ust-etiket ikincil">Sosyal medya</dt>
                <dd className="mt-4">
                  <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
                    {firma.sosyal.map((s) => (
                      <li key={s.ad}>
                        <a href={s.href} className="baglanti" target="_blank" rel="noopener noreferrer">
                          {s.ad}
                          <span className="ekran-okuyucu"> (yeni sekmede açılır)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7" data-gorun style={{ ["--gecikme" as string]: "0.1s" }}>
            <IletisimFormu />
          </div>
        </div>
      </div>
    </section>
  );
}
