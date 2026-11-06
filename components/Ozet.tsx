// Kurumsal özet: açılıştan sonra gelen sakin, tipografik bölüm.

import { kurumsal } from "@/content/site";

const olgular = [
  { deger: "2001", etiket: "Kuruluş", metin: "Ayakkabı tabanı tasarımı ve üretimi" },
  { deger: "2004", etiket: "Ayakkabı üretimi", metin: "Taban üretiminin yanında ayakkabı" },
  { deger: "2008", etiket: "Pierre Cardin", metin: "Erkek ayakkabı Türkiye alt lisansörlüğü" },
  { deger: "4", etiket: "Ülke", metin: "Türkiye, İran, Irak ve Suriye'de Pierre Cardin lisans hakkı" },
];

export default function Ozet() {
  return (
    <section id="icerik" data-tema="acik" aria-labelledby="ozet-baslik" className="bolum relative">
      <div className="mx-auto max-w-[1600px] px-[var(--kenar)] pt-[var(--ust-bosluk)] pb-[clamp(5rem,10vw,9rem)]">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="ust-etiket text-[var(--vurgu)] lg:col-span-3 lg:pt-3" data-gorun>
            Siltab Group
          </p>
          <div className="lg:col-span-9">
            <h2 id="ozet-baslik" className="ekran-okuyucu">
              Siltab Group hakkında
            </h2>
            <p className="serif text-[clamp(1.85rem,3.7vw,3.6rem)] leading-[1.12] font-light tracking-[-0.015em]" data-gorun>
              {kurumsal.ozet[0]} <span className="ikincil">{kurumsal.ozet[1]}</span>
            </p>
          </div>
        </div>

        <dl className="mt-[clamp(4rem,9vw,8rem)] grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-10">
          {olgular.map((o, i) => (
            <div
              key={o.deger + o.etiket}
              className="border-t border-[var(--cizgi)] pt-6"
              data-gorun
              style={{ ["--gecikme" as string]: `${i * 0.08}s` }}
            >
              <dt className="ust-etiket ikincil">{o.etiket}</dt>
              <dd className="mt-5">
                <span className="serif block text-[clamp(2.75rem,5vw,4.5rem)] leading-none font-light tabular-nums">
                  {o.deger}
                </span>
                <span className="mt-4 block max-w-[16rem] text-sm leading-relaxed ikincil">{o.metin}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
