// Sitenin bütün metinleri. Kaynak: BRIEF.md ve mevcut siltab.com.tr içeriği.
// Kaynakta olmayan bilgi yazılmaz; eksikler docs/MUSTERIYE-SORULACAKLAR.md dosyasında.

import type { KategoriKimligi } from "./urunler";

export const firma = {
  ad: "Siltab Group",
  kisaAd: "Siltab",
  sehir: "Başakşehir, İstanbul",
  kurulus: 2001,
  telefon: "+90 212 246 1320",
  telefonHref: "tel:+902122461320",
  eposta: "info@siltab.com.tr",
  adresSatirlari: [
    "Ziya Gökalp Mah. Süleyman Demirel Bulvarı",
    "Cumhuriyet Cad. No: 42 Sinpaş İş Modern Tic. Merkezi",
    "1. Etap EM Blok Çatıkatı İç Kapı No: E-58",
    "Başakşehir / İstanbul",
  ],
  // Kaynakta yalnızca kullanıcı adı (SiltabGroup) var. Tam adresler müşteriye soruldu.
  sosyal: [
    { ad: "Instagram", href: "https://www.instagram.com/siltabgroup" },
    { ad: "Facebook", href: "https://www.facebook.com/siltabgroup" },
    { ad: "Twitter", href: "https://twitter.com/siltabgroup" },
    { ad: "LinkedIn", href: "https://www.linkedin.com/company/siltabgroup" },
    { ad: "Pinterest", href: "https://www.pinterest.com/siltabgroup" },
  ],
  siteUrl: "https://www.siltab.com.tr",
} as const;

export const gezinme = [
  { id: "koleksiyon", ad: "Koleksiyon" },
  { id: "markalar", ad: "Markalar" },
  { id: "kurumsal", ad: "Kurumsal" },
  { id: "bayiler", ad: "Bayiler" },
  { id: "iletisim", ad: "İletişim" },
] as const;

export const kategoriAdlari: Record<KategoriKimligi, string> = {
  okceli: "Okçeli",
  bot: "Bot",
  canta: "Çanta",
  deri: "Deri",
  babet: "Babet",
  comfort: "Comfort",
  spor: "Spor",
};

/** Koleksiyon seçicisindeki sıra (brief'teki sıra) */
export const kategoriSirasi: KategoriKimligi[] = ["babet", "bot", "canta", "okceli", "comfort", "spor", "deri"];

export const acilis = {
  ust: "Siltab Group · İstanbul",
  baslik: ["Tabandan", "ayakkabıya."],
  metin:
    "2001'de ayakkabı tabanı tasarlamak ve üretmek için kuruldu. 2004'ten bu yana ayakkabı da üretiyor. Pierre Cardin Erkek Ayakkabı'nın Türkiye alt lisansörü.",
  kaydir: "Kaydırın",
  // Açılış sahnesinde sırayla gösterilen ürünler (content/urunler.ts kimlikleri)
  sahne: ["okceli-s09", "bot-s03", "canta-b-s26", "deri-s14", "babet-s01"],
};

export const koleksiyon = {
  ust: "Koleksiyon",
  baslik: "Kategoriler",
  metin:
    "Katalogdan seçilmiş modeller. Her model farklı renk seçenekleriyle üretiliyor. Koleksiyonların tamamı bayi girişinde.",
  renkEtiketi: "renk",
};

export const markalar = {
  ust: "Markalar",
  baslik: "Lisanslar ve markalar",
  pierreCardin: {
    ad: "Pierre Cardin",
    etiket: "Erkek ayakkabı · Türkiye alt lisansörü",
    metin: [
      "Siltab, 2008'den bu yana Pierre Cardin Erkek Ayakkabı'nın Türkiye alt lisansörüdür. Lisans anlaşması gereği Türkiye, İran, Irak ve Suriye'de lisans hakkına sahiptir.",
      "2018'de Pierre Cardin VIP Exclusive koleksiyonu hazırlandı.",
    ],
    bilgiler: [
      { deger: "1950", etiket: "Fransa'da kuruldu" },
      { deger: "140", etiket: "ülke" },
      { deger: "900", etiket: "ürün lisansı" },
      { deger: "1993", etiket: "Türkiye'de Aydınlı Grup" },
    ],
  },
  kuumLondon: {
    ad: "Kuum London",
    etiket: "Kış 2026 koleksiyonu",
    metin: [
      "Kuum London ürünleri Siltab bayi ağında satılıyor.",
      "Kış 2026 koleksiyonu bayi girişinde yer alıyor.",
    ],
  },
  stepMore: {
    ad: "Step More",
    etiket: "Türkiye ayakkabı lisansörü · 2021",
    metin: [
      "Maison De Couture grubunun genç kadınlara yönelik markası Step More'un Türkiye ayakkabı lisansörlüğü 2021'den bu yana Siltab'da.",
    ],
  },
};

export const kurumsal = {
  ust: "Kurumsal",
  baslik: "2001'den bu yana",
  ozet: [
    "Siltab Group, İstanbul Başakşehir merkezli bir ayakkabı üreticisi ve lisans sahibidir.",
    "2001'de ayakkabı tabanı tasarlamak ve üretmek için kuruldu, 2004'ten bu yana ayakkabı üretiyor.",
  ],
  metin: [
    "Siltab Group, İstanbul Başakşehir merkezli bir ayakkabı üreticisi ve lisans sahibidir.",
    "Şirket 2001'de İtalyan ve Türk ortaklığıyla ayakkabı tabanı tasarlamak ve üretmek için kuruldu. 2004'te İtalyan ortaklardan ayrıldı ve taban üretiminin yanında ayakkabı üretimine başladı.",
  ],
  zaman: [
    { yil: "2001", baslik: "Kuruluş", metin: "İtalyan ve Türk ortaklığıyla ayakkabı tabanı tasarımı ve üretimi." },
    { yil: "2004", baslik: "Ayakkabı üretimi", metin: "İtalyan ortaklardan ayrılış. Taban üretiminin yanında ayakkabı üretimi." },
    { yil: "2008", baslik: "Pierre Cardin", metin: "Pierre Cardin Erkek Ayakkabı Türkiye alt lisansörlüğü." },
    { yil: "2016", baslik: "Cacharel", metin: "Cacharel Erkek Ayakkabı Türkiye alt lisansörlüğü." },
    { yil: "2018", baslik: "VIP Exclusive", metin: "Pierre Cardin VIP Exclusive koleksiyonu." },
    { yil: "2021", baslik: "Step More", metin: "Step More markasının Türkiye ayakkabı lisansörlüğü." },
  ],
};

export const haberler = {
  ust: "Haberler",
  liste: [
    {
      baslik: "Pierre Cardin VIP Exclusive lansmanı",
      metin: "Bayi toplantısı 06-10 Kasım 2024 tarihlerinde Antalya Elit Lara Hotel'de yapıldı.",
      tarih: "Kasım 2024",
      gorsel: "/mevcut/pierre-cardin-vip-lansman.webp",
      alt: "Pierre Cardin VIP Exclusive lansman afişi",
      kesit: false,
    },
    {
      baslik: "Yeni sezon Pierre Cardin şıklığı showroom'da",
      metin: "Pierre Cardin erkek ayakkabılarının yeni sezon modelleri showroom'da.",
      tarih: null,
      gorsel: "/mevcut/pierre-cardin-bot-alfa.webp",
      alt: "Pierre Cardin erkek botları",
      kesit: true,
    },
  ],
};

export const bayiBolumu = {
  ust: "Bayi ağı",
  baslik: "Size en yakın bayi",
  metin: "Pierre Cardin ve Kuum London ürünlerini bulabileceğiniz bayileri il veya bayi adıyla arayın.",
  bayiEtiketi: "bayi",
  ilEtiketi: "il",
  kibrisNotu: "ve Kıbrıs",
  aramaYer: "İl, ilçe veya bayi adı",
  tumIller: "Tüm iller",
  sonucYok: "Bu aramayla eşleşen bayi bulunamadı.",
  dahaFazla: "Daha fazla göster",
  bayiOl: {
    baslik: "Bayimiz olun",
    metin: "Bayilik başvurusu ve bilgi için bizi arayın ya da iletişim formunu kullanın.",
  },
};

export const iletisim = {
  ust: "İletişim",
  baslik: "Bize ulaşın",
  konular: ["Bayilik başvurusu", "Ürün bilgisi", "Basın", "Diğer"],
  formNotu: "Bu form şu an yalnızca arayüz olarak çalışıyor, mesaj gönderilmiyor.",
  tesekkurBaslik: "Teşekkürler",
  tesekkurMetin:
    "Bilgileriniz doğrulandı. Form şu an yalnızca arayüz olarak çalıştığı için mesajınız iletilmedi. Lütfen e-posta veya telefonla ulaşın.",
};

export const tamirTakip = {
  baslik: "Tamir takip",
  metin: "Tamir sürecini irsaliye numarası ve güvenlik kodu ile sorgulayın.",
  irsaliye: "İrsaliye numarası",
  guvenlik: "Güvenlik kodu",
  gonder: "Sorgula",
  demoBaslik: "Gösterim sonucu",
  demoMetin:
    "Bu ekran tamir takip arayüzünün gösterimidir. Gerçek sorgu yapılmadı, aşağıdaki durum örnektir. Tamir durumunuz için arayın:",
  demoAdimlar: ["Teslim alındı", "İncelemede", "Tamirde", "Gönderime hazır"],
};

export const bayiGirisi = {
  baslik: "Bayi girişi",
  metin: "Koleksiyonları görmek için giriş yapın.",
  kullanici: "Kullanıcı adı",
  sifre: "Şifre",
  hatirla: "Beni hatırla",
  gonder: "Giriş yap",
  sifreTalebi: "Şifre talebi için arayın:",
  demoMetin: "Bu ekran bayi girişi arayüzünün gösterimidir, kimlik doğrulaması yapılmaz.",
};

export const altBilgi = {
  temsili: "Bazı atmosfer görselleri temsilidir, ürün fotoğrafı değildir.",
  telif: "Siltab Group",
};
