import Acilis from "@/components/Acilis";
import Alt from "@/components/Alt";
import Bayiler, { type Bayi } from "@/components/Bayiler";
import Haberler from "@/components/Haberler";
import Iletisim from "@/components/Iletisim";
import Kaydirma from "@/components/Kaydirma";
import Koleksiyon from "@/components/Koleksiyon";
import Kurumsal from "@/components/Kurumsal";
import Markalar from "@/components/Markalar";
import Ozet from "@/components/Ozet";
import Ust from "@/components/Ust";
import bayilerHam from "@/content/bayiler.json";
import { acilis } from "@/content/site";
import { ekUrunler, urunler } from "@/content/urunler";

// Bayi sayıları kaynak listeden derleme anında hesaplanır.
const bayiler = bayilerHam as Bayi[];
const ilAdlari = Array.from(new Set(bayiler.map((b) => b.il))).sort((a, b) => a.localeCompare(b, "tr"));
const kibrisVar = ilAdlari.includes("Kıbrıs");
const ilSayisi = ilAdlari.filter((i) => i !== "Kıbrıs").length;

const sahneUrunleri = acilis.sahne.map((id) => {
  const u = [...ekUrunler, ...urunler].find((x) => x.id === id);
  if (!u) throw new Error(`Açılış ürünü bulunamadı: ${id}`);
  return u;
});

export default function Sayfa() {
  return (
    <Kaydirma>
      <Ust />
      <main>
        <Acilis urunler={sahneUrunleri} />
        <Ozet />
        <Markalar />
        <Koleksiyon urunler={urunler} />
        <Kurumsal />
        <Bayiler bayiSayisi={bayiler.length} ilSayisi={ilSayisi} kibrisVar={kibrisVar} iller={ilAdlari} />
        <Haberler />
        <Iletisim />
      </main>
      <Alt />
    </Kaydirma>
  );
}
