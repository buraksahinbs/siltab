"use client";

// Tamir takip ve bayi girişi formları. İkisi de yalnızca arayüzdür: alanları doğrular,
// gerçek sorgu ya da kimlik doğrulama yapmaz ve bunu açıkça söyler.

import { useId, useState, type FormEvent } from "react";
import { bayiGirisi, firma, tamirTakip } from "@/content/site";

type Hatalar = Record<string, string | undefined>;

function Alan({
  etiket,
  hata,
  ...props
}: { etiket: string; hata?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="alan-etiket">
        {etiket}
      </label>
      <input
        id={id}
        className="alan"
        aria-invalid={hata ? true : undefined}
        aria-describedby={hata ? `${id}-hata` : undefined}
        {...props}
      />
      {hata && (
        <p id={`${id}-hata`} className="alan-hata">
          {hata}
        </p>
      )}
    </div>
  );
}

export function TamirTakipFormu() {
  const [irsaliye, setIrsaliye] = useState("");
  const [kod, setKod] = useState("");
  const [hatalar, setHatalar] = useState<Hatalar>({});
  const [sonuc, setSonuc] = useState<null | { irsaliye: string }>(null);

  const gonder = (e: FormEvent) => {
    e.preventDefault();
    const h: Hatalar = {};
    const temizIrsaliye = irsaliye.trim();
    if (!temizIrsaliye) h.irsaliye = "İrsaliye numarasını yazın.";
    else if (!/^[A-Za-z0-9-]{4,20}$/.test(temizIrsaliye))
      h.irsaliye = "İrsaliye numarası 4 ile 20 karakter, harf, rakam ya da tire olmalı.";
    if (!kod.trim()) h.kod = "Güvenlik kodunu yazın.";
    else if (!/^[A-Za-z0-9]{3,10}$/.test(kod.trim())) h.kod = "Güvenlik kodu 3 ile 10 harf ya da rakam olmalı.";
    setHatalar(h);
    if (Object.keys(h).length === 0) setSonuc({ irsaliye: temizIrsaliye });
  };

  if (sonuc) {
    return (
      <div aria-live="polite">
        <p className="ust-etiket text-taba">{tamirTakip.demoBaslik}</p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed ikincil">
          {tamirTakip.demoMetin}{" "}
          <a className="baglanti whitespace-nowrap text-[var(--yazi)]" href={firma.telefonHref}>
            {firma.telefon}
          </a>
        </p>
        <dl className="mt-8 border-t border-[var(--cizgi)] pt-6 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="ikincil">İrsaliye</dt>
            <dd className="tabular-nums">{sonuc.irsaliye}</dd>
          </div>
        </dl>
        <ol className="mt-6 grid gap-3" aria-label="Örnek tamir adımları">
          {tamirTakip.demoAdimlar.map((a, i) => (
            <li key={a} className="flex items-center gap-4 text-sm">
              <span
                className="block h-2 w-2 shrink-0 rounded-full"
                style={{ background: i <= 1 ? "var(--color-taba)" : "var(--cizgi)" }}
                aria-hidden="true"
              />
              <span className={i <= 1 ? "" : "ikincil"}>{a}</span>
              {i === 1 && <span className="ust-etiket ml-auto ikincil">örnek durum</span>}
            </li>
          ))}
        </ol>
        <button type="button" className="dugme dugme-cizgi mt-10" onClick={() => setSonuc(null)}>
          Yeni sorgu
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={gonder} noValidate className="grid gap-7">
      <p className="text-[0.9375rem] leading-relaxed ikincil">{tamirTakip.metin}</p>
      <Alan
        etiket={tamirTakip.irsaliye}
        name="irsaliye"
        autoComplete="off"
        inputMode="text"
        value={irsaliye}
        onChange={(e) => setIrsaliye(e.target.value)}
        hata={hatalar.irsaliye}
      />
      <Alan
        etiket={tamirTakip.guvenlik}
        name="kod"
        autoComplete="off"
        value={kod}
        onChange={(e) => setKod(e.target.value)}
        hata={hatalar.kod}
      />
      <div className="mt-2">
        <button type="submit" className="dugme dugme-dolu w-full sm:w-auto">
          {tamirTakip.gonder}
        </button>
      </div>
    </form>
  );
}

export function BayiGirisFormu() {
  const [kullanici, setKullanici] = useState("");
  const [sifre, setSifre] = useState("");
  const [hatalar, setHatalar] = useState<Hatalar>({});
  const [bilgi, setBilgi] = useState(false);

  const gonder = (e: FormEvent) => {
    e.preventDefault();
    const h: Hatalar = {};
    if (!kullanici.trim()) h.kullanici = "Kullanıcı adını yazın.";
    if (!sifre) h.sifre = "Şifreyi yazın.";
    setHatalar(h);
    setBilgi(Object.keys(h).length === 0);
  };

  return (
    <form onSubmit={gonder} noValidate className="grid gap-7">
      <p className="text-[0.9375rem] leading-relaxed ikincil">{bayiGirisi.metin}</p>
      <Alan
        etiket={bayiGirisi.kullanici}
        name="kullanici"
        autoComplete="username"
        value={kullanici}
        onChange={(e) => setKullanici(e.target.value)}
        hata={hatalar.kullanici}
      />
      <Alan
        etiket={bayiGirisi.sifre}
        name="sifre"
        type="password"
        autoComplete="current-password"
        value={sifre}
        onChange={(e) => setSifre(e.target.value)}
        hata={hatalar.sifre}
      />
      <label className="flex cursor-pointer items-center gap-3 text-sm ikincil">
        <input type="checkbox" name="hatirla" className="kutucuk" />
        {bayiGirisi.hatirla}
      </label>
      {bilgi && (
        <p className="border-l border-taba pl-4 text-sm leading-relaxed" role="status">
          {bayiGirisi.demoMetin}
        </p>
      )}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="dugme dugme-dolu">
          {bayiGirisi.gonder}
        </button>
        <p className="text-sm ikincil">
          {bayiGirisi.sifreTalebi}{" "}
          <a className="baglanti whitespace-nowrap text-[var(--yazi)]" href={firma.telefonHref}>
            {firma.telefon}
          </a>
        </p>
      </div>
    </form>
  );
}
