// Hafif kaydırma izleyicisi: bir öğenin sayfadaki konumuna göre 0..1 ilerleme hesaplar.
// Ölçüler yalnızca yenilemede (boyut değişimi, yazı tipi ve görsel yüklenmesi) okunur;
// kaydırma sırasında düzen okunmaz. Lenis pencereyi kaydırdığı için yerel "scroll" olayı yeterlidir.

export type Olcu = { ust: number; yukseklik: number; vh: number };
type Aralik = (o: Olcu) => [number, number];
type Kayit = { el: HTMLElement; aralik: Aralik; cb: (p: number) => void; bas: number; son: number; sonP: number };

const kayitlar = new Set<Kayit>();
let kuruldu = false;
let bekliyor = false;
let zamanlayici: number | undefined;

const kis = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function olc(k: Kayit) {
  const r = k.el.getBoundingClientRect();
  const [bas, son] = k.aralik({ ust: r.top + window.scrollY, yukseklik: r.height, vh: window.innerHeight });
  k.bas = bas;
  k.son = son;
}

function hesapla(zorla = false) {
  const y = window.scrollY;
  for (const k of kayitlar) {
    const p = k.son > k.bas ? kis((y - k.bas) / (k.son - k.bas)) : y >= k.bas ? 1 : 0;
    if (zorla || p !== k.sonP) {
      k.sonP = p;
      k.cb(p);
    }
  }
}

/** Tüm ölçüleri tazele (düzen değiştiğinde çağır) */
export function yenile() {
  kayitlar.forEach(olc);
  hesapla(true);
}

function gecikmeliYenile() {
  window.clearTimeout(zamanlayici);
  zamanlayici = window.setTimeout(yenile, 100);
}

function kur() {
  if (kuruldu) return;
  kuruldu = true;
  window.addEventListener(
    "scroll",
    () => {
      if (bekliyor) return;
      bekliyor = true;
      requestAnimationFrame(() => {
        bekliyor = false;
        hesapla();
      });
    },
    { passive: true },
  );
  window.addEventListener("resize", gecikmeliYenile);
  window.addEventListener("load", yenile);
  document.fonts?.ready.then(yenile);
  new ResizeObserver(gecikmeliYenile).observe(document.body);
}

/**
 * Öğeyi izle. `aralik` sayfa koordinatlarında [başlangıç, bitiş] kaydırma değerini döndürür.
 * Dönen işlev izlemeyi bırakır.
 */
let yenileBekliyor = false;

export function izle(el: HTMLElement, aralik: Aralik, cb: (p: number) => void): () => void {
  kur();
  const k: Kayit = { el, aralik, cb, bas: 0, son: 1, sonP: -1 };
  kayitlar.add(k);
  // Ölçüm ve ilk çağrı bir sonraki karede toplu yapılır: art arda kayıtlarda
  // oku-yaz-oku döngüsü (zorunlu yeniden akış) oluşmasın.
  if (!yenileBekliyor) {
    yenileBekliyor = true;
    requestAnimationFrame(() => {
      yenileBekliyor = false;
      yenile();
    });
  }
  return () => {
    kayitlar.delete(k);
  };
}

/** Yapışkan (sticky) bölüm: üst kenar ekran üstüne değdiğinde 0, alt kenar ekran altına değdiğinde 1 */
export const yapiskanAralik: Aralik = (o) => [o.ust, o.ust + o.yukseklik - o.vh];
