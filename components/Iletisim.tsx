"use client";

// İletişim: adres, telefon, e-posta, sosyal bağlantılar ve form arayüzü.
// Form gönderme yapmaz: alanları doğrular, teşekkür durumunu gösterir ve bunu açıkça söyler.

import { useId, useState, type FormEvent } from "react";
import { firma, iletisim } from "@/content/site";

type Veri = { ad: string; eposta: string; telefon: string; konu: string; mesaj: string; onay: boolean };
type Hatalar = Partial<Record<keyof Veri, string>>;

const bos: Veri = { ad: "", eposta: "", telefon: "", konu: "", mesaj: "", onay: false };

function dogrula(v: Veri): Hatalar {
  const h: Hatalar = {};
  if (v.ad.trim().length < 2) h.ad = "Adınızı ve soyadınızı yazın.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.eposta.trim())) h.eposta = "Geçerli bir e-posta adresi yazın.";
  const rakam = v.telefon.replace(/\D/g, "");
  if (v.telefon.trim() && (rakam.length < 10 || rakam.length > 13)) h.telefon = "Telefon numarası 10 ile 13 rakam olmalı.";
  if (!v.konu) h.konu = "Bir konu seçin.";
  if (v.mesaj.trim().length < 10) h.mesaj = "Mesajınız en az 10 karakter olmalı.";
  if (!v.onay) h.onay = "Devam etmek için onay kutusunu işaretleyin.";
  return h;
}

export default function Iletisim() {
  const [v, setV] = useState<Veri>(bos);
  const [hatalar, setHatalar] = useState<Hatalar>({});
  const [bitti, setBitti] = useState(false);
  const id = useId();

  const alan = (k: keyof Veri) => ({
    id: `${id}-${k}`,
    name: k,
    "aria-invalid": hatalar[k] ? true : undefined,
    "aria-describedby": hatalar[k] ? `${id}-${k}-hata` : undefined,
  });
  const degis = (k: keyof Veri, deger: string | boolean) => {
    setV((o) => ({ ...o, [k]: deger }));
    if (hatalar[k]) setHatalar((h) => ({ ...h, [k]: undefined }));
  };
  const hata = (k: keyof Veri) =>
    hatalar[k] ? (
      <p id={`${id}-${k}-hata`} className="alan-hata">
        {hatalar[k]}
      </p>
    ) : null;

  const gonder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const h = dogrula(v);
    setHatalar(h);
    const ilk = Object.keys(h)[0];
    if (ilk) {
      document.getElementById(`${id}-${ilk}`)?.focus();
      return;
    }
    setBitti(true);
  };

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
            {bitti ? (
              <div className="border-t border-[var(--cizgi)] pt-10" role="status" aria-live="polite">
                <p className="baslik-2">{iletisim.tesekkurBaslik}, {v.ad.trim().split(" ")[0]}.</p>
                <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-relaxed ikincil">{iletisim.tesekkurMetin}</p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href={`mailto:${firma.eposta}`} className="dugme dugme-dolu">
                    E-posta yazın
                  </a>
                  <button
                    type="button"
                    className="dugme dugme-cizgi"
                    onClick={() => {
                      setV(bos);
                      setBitti(false);
                    }}
                  >
                    Formu temizle
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={gonder} noValidate className="grid gap-9" aria-describedby={`${id}-not`}>
                <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <label htmlFor={`${id}-ad`} className="alan-etiket">
                      Ad soyad
                    </label>
                    <input
                      {...alan("ad")}
                      className="alan"
                      autoComplete="name"
                      value={v.ad}
                      onChange={(e) => degis("ad", e.target.value)}
                    />
                    {hata("ad")}
                  </div>
                  <div>
                    <label htmlFor={`${id}-eposta`} className="alan-etiket">
                      E-posta
                    </label>
                    <input
                      {...alan("eposta")}
                      type="email"
                      className="alan"
                      autoComplete="email"
                      value={v.eposta}
                      onChange={(e) => degis("eposta", e.target.value)}
                    />
                    {hata("eposta")}
                  </div>
                  <div>
                    <label htmlFor={`${id}-telefon`} className="alan-etiket">
                      Telefon <span className="normal-case tracking-normal opacity-70">(isteğe bağlı)</span>
                    </label>
                    <input
                      {...alan("telefon")}
                      type="tel"
                      className="alan"
                      autoComplete="tel"
                      inputMode="tel"
                      value={v.telefon}
                      onChange={(e) => degis("telefon", e.target.value)}
                    />
                    {hata("telefon")}
                  </div>
                  <div>
                    <label htmlFor={`${id}-konu`} className="alan-etiket">
                      Konu
                    </label>
                    <select {...alan("konu")} className="alan" value={v.konu} onChange={(e) => degis("konu", e.target.value)}>
                      <option value="">Seçin</option>
                      {iletisim.konular.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                    {hata("konu")}
                  </div>
                </div>
                <div>
                  <label htmlFor={`${id}-mesaj`} className="alan-etiket">
                    Mesaj
                  </label>
                  <textarea
                    {...alan("mesaj")}
                    rows={4}
                    className="alan resize-y"
                    value={v.mesaj}
                    onChange={(e) => degis("mesaj", e.target.value)}
                  />
                  {hata("mesaj")}
                </div>
                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed ikincil">
                    <input
                      {...alan("onay")}
                      type="checkbox"
                      className="kutucuk mt-1"
                      checked={v.onay}
                      onChange={(e) => degis("onay", e.target.checked)}
                    />
                    Bilgilerimin bu talep için kullanılmasını kabul ediyorum.
                  </label>
                  {hata("onay")}
                </div>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" className="dugme dugme-dolu">
                    Gönder
                  </button>
                  <p id={`${id}-not`} className="max-w-[20rem] text-xs leading-relaxed ikincil sm:text-right">
                    {iletisim.formNotu}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
