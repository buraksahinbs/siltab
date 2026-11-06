#!/usr/bin/env python3
"""Katalog kesitlerinden etiket ve fiyat metnini temizler.

Giriş : kaynak/drive/<kat>/*.jpeg  (dizin: kaynak/katalog-index.json)
Çıkış : public/urun/<kat>/<ad>.webp       (beyaz zemin, kare, 1200 px)
        docs/_kontrol/tum-urunler.json    (tüm ürün grupları; sitede kullanılan seçim
                                           scripts/urun-sec.py ile content/urunler.ts dosyasına yazılır)
        docs/_kontrol/temizlik-rapor.json (her görsel için atılan bileşenler)

Yöntem:
1. Zemin rengi kenar piksellerinin medyanından bulunur.
2. Zeminden belirgin biçimde ayrılan pikseller ön plan maskesidir.
3. Maske hafifçe genişletilir, bağlantılı bileşenler bulunur.
4. En büyük bileşen üründür. Ona yakın büyüklükteki bileşenler (çift ayakkabı,
   çanta askısı gibi) korunur. Metin satırı biçimindeki bileşenler (alçak, geniş,
   küçük alanlı) atılır.
5. Korunan bölge dışındaki her piksel saf beyaza boyanır. Böylece kırpma kutusu
   içine düşen etiket parçaları da silinir.
6. Ürün kareye ortalanır ve webp olarak yazılır.

Kullanım: .venv/bin/python -I scripts/urun-temizle.py [--sadece kat1,kat2] [--zorla]
"""
from __future__ import annotations

import argparse
import json
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

KOK = Path(__file__).resolve().parent.parent
KAYNAK = KOK / "kaynak" / "drive"
DIZIN = KOK / "kaynak" / "katalog-index.json"
CIKIS = KOK / "public" / "urun"
TUM = KOK / "docs" / "_kontrol" / "tum-urunler.json"
RAPOR = KOK / "docs" / "_kontrol" / "temizlik-rapor.json"

BOYUT = 1200
ANALIZ = 700  # analiz çözünürlüğü (uzun kenar)
DOLULUK = 0.84  # ürünün karedeki payı

KATEGORI = {
    "babet": "babet",
    "bot": "bot",
    "canta-a": "canta",
    "canta-b": "canta",
    "canta-c": "canta",
    "comfort": "comfort",
    "deri": "deri",
    "okceli": "okceli",
    "spor": "spor",
}


def zemin_rengi(a: np.ndarray) -> np.ndarray:
    kenar = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    return np.median(kenar, axis=0)


def on_plan(a: np.ndarray, zemin: np.ndarray, esik: float = 26.0) -> np.ndarray:
    fark = np.abs(a.astype(np.int16) - zemin.astype(np.int16)).max(axis=2)
    return fark > esik


def metin_gibi(kutu, alan: int, en_buyuk: int, h: int, w: int) -> bool:
    ys, xs = kutu
    kh = ys.stop - ys.start
    kw = xs.stop - xs.start
    oran = kw / max(kh, 1)
    # alçak ve görece geniş satır: etiket metni
    if kh < 0.075 * h and oran > 1.6:
        return True
    # küçük alanlı her şey (tek harf, rakam grubu, nokta)
    if alan < 0.06 * en_buyuk:
        return True
    return False


def metin_satirlari(m: np.ndarray, en_az: int = 4) -> list[tuple[int, int, int, int]]:
    """Ham ön plan maskesinde harf biçimli küçük bileşenlerden oluşan metin satırlarını bulur.

    Etiket ürüne değdiğinde (ör. çanta şalı etiketin üstüne düştüğünde) metin, ürünle aynı
    bağlantılı bileşene karışır. Harflerin çoğu yine de zeminle çevrili ayrı küçük
    bileşenlerdir: benzer yükseklikte, aynı satırda, yan yana. En az `en_az` harflik
    gruplar metin satırı sayılır. Dönüş: (y0, y1, x0, x1) dikdörtgenleri.
    """
    etiket, n = ndi.label(m)
    if n == 0:
        return []
    kutular = ndi.find_objects(etiket)
    alanlar = ndi.sum(m, etiket, index=np.arange(1, n + 1))
    adaylar = []
    for i, k in enumerate(kutular):
        kh = k[0].stop - k[0].start
        kw = k[1].stop - k[1].start
        if 6 <= kh <= 34 and 2 <= kw <= 40 and alanlar[i] <= 700 and kw <= 2.5 * kh:
            adaylar.append((k[0].start, k[0].stop, k[1].start, k[1].stop))
    if len(adaylar) < en_az:
        return []
    adaylar.sort(key=lambda b: b[2])
    # birleşim-bul: aynı satırda ve yakın komşu
    ebeveyn = list(range(len(adaylar)))

    def bul(i):
        while ebeveyn[i] != i:
            ebeveyn[i] = ebeveyn[ebeveyn[i]]
            i = ebeveyn[i]
        return i

    for i, a in enumerate(adaylar):
        ah = a[1] - a[0]
        for j in range(i + 1, len(adaylar)):
            b = adaylar[j]
            if b[2] - a[3] > 1.6 * max(ah, b[1] - b[0]):
                break
            bh = b[1] - b[0]
            ortak = min(a[1], b[1]) - max(a[0], b[0])
            if ortak >= 0.55 * min(ah, bh) and max(ah, bh) <= 2.6 * min(ah, bh):
                ebeveyn[bul(i)] = bul(j)
    gruplar: dict[int, list] = {}
    for i, a in enumerate(adaylar):
        gruplar.setdefault(bul(i), []).append(a)
    satirlar = []
    for g in gruplar.values():
        if len(g) < en_az:
            continue
        y0 = min(b[0] for b in g)
        y1 = max(b[1] for b in g)
        x0 = min(b[2] for b in g)
        x1 = max(b[3] for b in g)
        # tek satır olmalı: satır yüksekliği harf yüksekliğinin çok üstünde olmamalı
        orta_h = float(np.median([b[1] - b[0] for b in g]))
        if (y1 - y0) > 2.2 * orta_h:
            continue
        satirlar.append((y0, y1, x0, x1))
    return satirlar


def metin_kontrol(im: Image.Image) -> list[tuple[int, int, int, int]]:
    """Temizlenmiş çıktıda kalan metin satırlarını arar (otomatik denetim)."""
    k = ANALIZ / max(im.size)
    kucuk = im.convert("RGB").resize((round(im.size[0] * k), round(im.size[1] * k)), Image.BILINEAR)
    a = np.asarray(kucuk)
    return metin_satirlari(on_plan(a, zemin_rengi(a)))


def temizle(yol: Path):
    im = Image.open(yol).convert("RGB")
    W, H = im.size
    olcek = ANALIZ / max(W, H)
    kucuk = im.resize((max(1, round(W * olcek)), max(1, round(H * olcek))), Image.BILINEAR)
    a = np.asarray(kucuk)
    h, w = a.shape[:2]
    zemin = zemin_rengi(a)
    ham = on_plan(a, zemin)
    m = ndi.binary_opening(ham, iterations=1)  # JPEG gürültüsü

    # ürüne değen etiket satırlarını maskeden sil
    satirlar = metin_satirlari(ham)
    for y0, y1, x0, x1 in satirlar:
        p = 4
        m[max(0, y0 - p) : y1 + p, max(0, x0 - p) : x1 + p] = False

    # ürün parçalarını birleştir (metinle birleşmeyecek kadar küçük genişletme)
    birlesik = ndi.binary_dilation(m, iterations=3)
    etiket, n = ndi.label(birlesik)
    if n == 0:
        return None, {"hata": "on plan yok"}
    alanlar = ndi.sum(m, etiket, index=np.arange(1, n + 1)).astype(int)
    kutular = ndi.find_objects(etiket)
    en_buyuk_i = int(np.argmax(alanlar))
    en_buyuk = int(alanlar[en_buyuk_i])

    korunan = []
    atilan = []
    for i in range(n):
        kutu = kutular[i]
        alan = int(alanlar[i])
        bilgi = {
            "y": [kutu[0].start, kutu[0].stop],
            "x": [kutu[1].start, kutu[1].stop],
            "alan": alan,
        }
        if i == en_buyuk_i:
            korunan.append(i + 1)
            continue
        if alan >= 0.15 * en_buyuk and not metin_gibi(kutu, alan, en_buyuk, h, w):
            korunan.append(i + 1)
        else:
            atilan.append(bilgi)

    koru = np.isin(etiket, korunan) & birlesik
    koru = ndi.binary_fill_holes(koru)
    # yumuşak kenar ve hafif gölge payı
    koru = ndi.binary_dilation(koru, iterations=2)

    ys, xs = np.where(koru)
    y0, y1 = ys.min(), ys.max() + 1
    x0, x1 = xs.min(), xs.max() + 1

    # tam çözünürlüğe maske
    maske = Image.fromarray((koru * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
    maske = maske.filter(ImageFilter.GaussianBlur(radius=max(1.5, 2.0 / olcek)))
    beyaz = Image.new("RGB", (W, H), (255, 255, 255))
    temiz = Image.composite(im, beyaz, maske)

    # zemini saf beyaza çek (kırık beyaz zeminleri eşitle)
    ta = np.asarray(temiz).astype(np.float32)
    z = zemin.astype(np.float32)
    duzelt = np.clip(255.0 / np.maximum(z, 1.0), 1.0, 1.25)
    ta = np.clip(ta * duzelt, 0, 255).astype(np.uint8)
    temiz = Image.fromarray(ta)

    X0, X1 = int(x0 / olcek), int(np.ceil(x1 / olcek))
    Y0, Y1 = int(y0 / olcek), int(np.ceil(y1 / olcek))
    X0, Y0 = max(0, X0), max(0, Y0)
    X1, Y1 = min(W, X1), min(H, Y1)
    kirp = temiz.crop((X0, Y0, X1, Y1))

    kw, kh = kirp.size
    hedef = int(BOYUT * DOLULUK)
    k = hedef / max(kw, kh)
    nw, nh = max(1, round(kw * k)), max(1, round(kh * k))
    kirp = kirp.resize((nw, nh), Image.LANCZOS)

    tuval = Image.new("RGB", (BOYUT, BOYUT), (255, 255, 255))
    ox, oy = (BOYUT - nw) // 2, (BOYUT - nh) // 2
    tuval.paste(kirp, (ox, oy))


    rapor = {
        "boyut": [W, H],
        "kutu": [X0, Y0, X1, Y1],
        "korunan": len(korunan),
        "atilan": atilan,
        "metin_satiri": [list(map(int, x)) for x in satirlar],
    }
    return tuval, rapor


def isle(is_):
    giris, cikis, anahtar = is_
    sonuc, r = temizle(Path(giris))
    if sonuc is None:
        return anahtar, r
    tuval = sonuc
    r["kalan_metin"] = [list(map(int, x)) for x in metin_kontrol(tuval)]
    Path(cikis).parent.mkdir(parents=True, exist_ok=True)
    tuval.save(cikis, "WEBP", quality=82, method=4)
    return anahtar, r


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sadece", default="")
    ap.add_argument("--zorla", action="store_true")
    args = ap.parse_args()
    sadece = set(filter(None, args.sadece.split(",")))

    dizin = json.loads(DIZIN.read_text(encoding="utf-8"))
    rapor = json.loads(RAPOR.read_text(encoding="utf-8")) if RAPOR.exists() and not args.zorla else {}
    gruplar: dict[tuple[str, int], list[str]] = {}

    isler = []
    for kayit in dizin:
        kat = kayit["kat"]
        ad = Path(kayit["dosya"]).stem
        giris = KAYNAK / kat / Path(kayit["dosya"]).name
        cikis = CIKIS / kat / f"{ad}.webp"
        if not giris.exists():
            print(f"eksik: {giris}", file=sys.stderr)
            continue
        if (not sadece or kat in sadece) and (args.zorla or not cikis.exists()):
            isler.append((str(giris), str(cikis), f"{kat}/{ad}"))

    with ProcessPoolExecutor() as havuz:
        for anahtar, r in havuz.map(isle, isler, chunksize=4):
            rapor[anahtar] = r
            print(f"ok {anahtar} atılan={len(r.get('atilan', []))}", flush=True)

    for kayit in dizin:
        kat = kayit["kat"]
        ad = Path(kayit["dosya"]).stem
        giris = KAYNAK / kat / Path(kayit["dosya"]).name
        cikis = CIKIS / kat / f"{ad}.webp"
        if cikis.exists():
            gruplar.setdefault((kat, kayit["sayfa"]), []).append(ad)

    urunler = []
    for (kat, sayfa), adlar in sorted(gruplar.items(), key=lambda x: (x[0][0], x[0][1])):
        adlar = sorted(adlar)
        urunler.append(
            {
                "id": f"{kat}-s{sayfa:02d}",
                "kategori": KATEGORI[kat],
                "sayfa": sayfa,
                "gorseller": [f"/urun/{kat}/{a}.webp" for a in adlar],
            }
        )

    TUM.parent.mkdir(parents=True, exist_ok=True)
    TUM.write_text(json.dumps(urunler, ensure_ascii=False, indent=1), encoding="utf-8")
    RAPOR.parent.mkdir(parents=True, exist_ok=True)
    RAPOR.write_text(json.dumps(rapor, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(urunler)} ürün grubu, {sum(len(u['gorseller']) for u in urunler)} görsel")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
