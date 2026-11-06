// Açılış sahnesinin kaydırma durumu. DOM (metinler) ve WebGL (kartlar) aynı değeri okur.

export const GIRIS_PAYI = 0.07; // kaydırmanın ilk %7'si açılış metni
export const GECIS_PAYI = 0.26; // her aşamanın başında karuselin kayma payı
export const DONUS_BASLA = 0.3; // aşama içinde dönüşün başladığı yer
export const DONUS_BITIS = 0.94;

export const sahneDurumu = {
  /** kaydırmadan gelen hedef ilerleme (0..1) */
  hedef: 0,
  /** sönümlenmiş ilerleme: sahne ve metinler bunu kullanır */
  deger: 0,
  /** imleç konumu (-1..1), sönümlenmiş */
  imlecX: 0,
  imlecY: 0,
  imlecHedefX: 0,
  imlecHedefY: 0,
};

const kis = (x: number) => Math.min(1, Math.max(0, x));
// yumuşak giriş ve çıkış (quintic smootherstep)
export const yumusak = (x: number) => {
  const t = kis(x);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export type Cozum = {
  /** -1: açılış metni, 0..n-1: ürün aşaması (kaydırma payına göre) */
  asama: number;
  /** ekranın ortasındaki kart: metinler bunu izler (geçişin yarısında değişir) */
  ondeki: number;
  /** karuselin odak konumu (kesirli ürün sırası) */
  odak: number;
  /** her kartın kendi ekseni etrafındaki dönüşü (radyan) */
  donusler: number[];
  /** öndeki kartta görünen renk sırası */
  renk: number;
  /** açılış payı içindeki ilerleme 0..1 */
  giris: number;
  /** aşama içindeki ilerleme 0..1 */
  yerel: number;
};

/** Kartın yönüne göre kameraya bakan rengin sırası. Ön yüz: 0 ya da 2, arka yüz: 1. */
export function gorunenRenk(donus: number, renkSayisi: number): number {
  const c = Math.cos(donus);
  if (c >= 0) return donus < Math.PI ? 0 : renkSayisi >= 3 ? 2 : 0;
  return 1 % renkSayisi;
}

/** Ön yüze yerleştirilecek doku sırası (yüz kameraya dönükken değişmez) */
export function onYuzRengi(donus: number, renkSayisi: number): number {
  return donus < Math.PI ? 0 : renkSayisi >= 3 ? 2 : 0;
}

export function cozumle(p: number, renkSayilari: number[]): Cozum {
  const n = renkSayilari.length;
  const donusler = new Array(n).fill(0);
  if (p < GIRIS_PAYI) {
    return { asama: -1, ondeki: -1, odak: 0, donusler, renk: 0, giris: p / GIRIS_PAYI, yerel: 0 };
  }
  const f = ((p - GIRIS_PAYI) / (1 - GIRIS_PAYI)) * n;
  const i = Math.min(n - 1, Math.floor(f));
  const t = Math.min(1, f - i);
  const gecis = i === 0 ? 1 : yumusak(t / GECIS_PAYI);
  const odak = i === 0 ? 0 : i - 1 + gecis;
  const basla = i === 0 ? 0.12 : DONUS_BASLA;
  const donus = yumusak((t - basla) / (DONUS_BITIS - basla)) * Math.PI * 2;
  for (let k = 0; k < n; k++) donusler[k] = k < i ? Math.PI * 2 : k === i ? donus : 0;
  const ondeki = Math.min(n - 1, Math.max(0, Math.round(odak)));
  return {
    asama: i,
    ondeki,
    odak,
    donusler,
    renk: gorunenRenk(donusler[ondeki], renkSayilari[ondeki]),
    giris: 1,
    yerel: t,
  };
}
