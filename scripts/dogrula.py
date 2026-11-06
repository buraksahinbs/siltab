#!/usr/bin/env python3
"""Ekran görüntüsü doğrulaması (BRIEF, KRİTİK DÜZELTME madde 4).

1. Hareket: ardışık görüntüler arasındaki ortalama piksel farkı. Kaydırmaya bağlı sahnede
   her nokta bir öncekinden belirgin biçimde farklı olmalı.
2. Açık renk dikdörtgen: görüntüde zeminden ayrışan, büyük, dolu ve dikdörtgen biçimli açık
   renkli alan (ör. ürün çevresinde beyaz kart) aranır. Koyu zeminde açık alanlar, açık
   (krem) zeminde saf beyaza yakın alanlar denetlenir.

Kullanım: .venv/bin/python -I scripts/dogrula.py <görüntü1.png> <görüntü2.png> ...
Çıkış kodu: sorun varsa 1.
"""
from __future__ import annotations

import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ESIK_ORAN = 1.0  # değişen piksel oranı (yüzde): |fark| > 12 olan pikseller en az bu kadar olmalı


def gri(yol: str) -> np.ndarray:
    im = Image.open(yol).convert("L")
    im = im.resize((480, round(480 * im.height / im.width)), Image.BILINEAR)
    return np.asarray(im).astype(np.float32)


def dikdortgen_ara(yol: str) -> list[str]:
    im = Image.open(yol).convert("RGB")
    k = 640 / im.width
    im = im.resize((640, round(im.height * k)), Image.BILINEAR)
    a = np.asarray(im).astype(np.int16)
    h, w = a.shape[:2]
    # zemin: kenar piksellerinin medyanı
    kenar = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    zemin = np.median(kenar, axis=0)
    parlak_zemin = zemin.mean() > 128
    if parlak_zemin:
        maske = (a.min(axis=2) >= 251)  # krem zeminde saf beyaz alan
    else:
        maske = (a.mean(axis=2) >= 200) & (a.max(axis=2) - a.min(axis=2) < 40)  # koyu zeminde açık nötr alan
    maske = ndi.binary_opening(maske, iterations=1)
    etiket, n = ndi.label(maske)
    sorunlar = []
    for i, kutu in enumerate(ndi.find_objects(etiket)):
        kh = kutu[0].stop - kutu[0].start
        kw = kutu[1].stop - kutu[1].start
        alan = int((etiket[kutu] == i + 1).sum())
        doluluk = alan / max(1, kh * kw)
        if kh * kw > 0.012 * w * h and doluluk > 0.8 and kh > 0.08 * h and kw > 0.06 * w:
            sorunlar.append(f"açık dikdörtgen {kw}x{kh}px (doluluk {doluluk:.2f}) konum x={kutu[1].start} y={kutu[0].start}")
    return sorunlar


def main() -> int:
    yollar = sys.argv[1:]
    hata = False
    onceki = None
    for y in yollar:
        g = gri(y)
        fark = oran = None
        if onceki is not None and onceki.shape == g.shape:
            f = np.abs(g - onceki)
            fark = float(f.mean())
            oran = float((f > 12).mean() * 100)
        onceki = g
        sorunlar = dikdortgen_ara(y)
        durum = []
        if fark is not None:
            durum.append(f"ortalama fark {fark:5.2f}, değişen piksel %{oran:5.1f}")
            if oran < ESIK_ORAN:
                durum.append("HAREKET YOK")
                hata = True
        if sorunlar:
            hata = True
            durum += sorunlar
        print(f"{y}: {'; '.join(durum) or 'ilk'}")
    print("SONUÇ:", "SORUN VAR" if hata else "geçti")
    return 1 if hata else 0


if __name__ == "__main__":
    raise SystemExit(main())
