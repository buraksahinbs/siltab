#!/usr/bin/env python3
"""Mevcut site varlıklarından marka logolarını saydam zeminli olarak çıkarır.

Giriş : kaynak/siltab-mevcut/
Çıkış : public/marka/*.png  ve  public/mevcut/*.webp (mevcut sitenin ürün ve lansman fotoğrafları)

- pierre-cardin-koyu.png  : siyah "pierre cardin PARIS" (açık zemin için)
- pierre-cardin-acik.png  : aynı logo, kırık beyaz (koyu zemin için)
- kuum-london.png         : kırmızı Kuum London logosu (açık zemin için)
- kuum-london-acik.png    : aynı logo, kırık beyaz (koyu zemin için)

Slaytlar kullanılmaz (metin gömülü, kalite düşük).
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

KOK = Path(__file__).resolve().parent.parent
K = KOK / "kaynak" / "siltab-mevcut"
MARKA = KOK / "public" / "marka"
MEVCUT = KOK / "public" / "mevcut"
ACIK = (246, 242, 236)  # #F6F2EC


def beyazdan_alfa(yol: Path, renk: tuple[int, int, int] | None, kenar: int = 6) -> Image.Image:
    """Beyaz zeminli logodan saydam görsel üretir. renk verilirse tek renge boyar."""
    a = np.asarray(Image.open(yol).convert("RGB")).astype(np.float32)
    # beyaza uzaklık: koyu ve doygun pikseller logo
    uzaklik = 255.0 - a.min(axis=2)
    alfa = np.clip(uzaklik / 200.0, 0, 1)
    # kaynakta logonun çevresinde ince çerçeve çizgisi olabilir: kenar şeridini temizle
    alfa[:12, :] = 0
    alfa[-12:, :] = 0
    alfa[:, :12] = 0
    alfa[:, -12:] = 0
    ys, xs = np.where(alfa > 0.15)
    y0, y1 = max(0, ys.min() - kenar), min(a.shape[0], ys.max() + kenar + 1)
    x0, x1 = max(0, xs.min() - kenar), min(a.shape[1], xs.max() + kenar + 1)
    alfa = alfa[y0:y1, x0:x1]
    if renk is None:
        # rengi koru: beyazla karışmış rengi geri çöz
        rgb = a[y0:y1, x0:x1]
        al = np.maximum(alfa[..., None], 1e-3)
        rgb = np.clip((rgb - 255.0 * (1 - al)) / al, 0, 255)
    else:
        rgb = np.broadcast_to(np.array(renk, np.float32), (*alfa.shape, 3))
    out = np.dstack([rgb, alfa * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def main() -> None:
    MARKA.mkdir(parents=True, exist_ok=True)
    MEVCUT.mkdir(parents=True, exist_ok=True)

    pc = K / "page-59c7fa72.png"
    beyazdan_alfa(pc, (14, 21, 18)).save(MARKA / "pierre-cardin-koyu.png", optimize=True)
    beyazdan_alfa(pc, ACIK).save(MARKA / "pierre-cardin-acik.png", optimize=True)

    kuum = K / "page-2237732a.png"
    beyazdan_alfa(kuum, None).save(MARKA / "kuum-london.png", optimize=True)
    beyazdan_alfa(kuum, ACIK).save(MARKA / "kuum-london-acik.png", optimize=True)

    for ad, hedef in [
        ("pierre-cardin-man-21f20cb0.jpg", "pierre-cardin-erkek"),
        ("pierre-cardin-shoes-2-0c938127.jpg", "pierre-cardin-bot"),
        ("pierre-cardin-shoes-e5874a7f-865d3c7c.jpg", "pierre-cardin-klasik"),
        ("about-figure-fb2da824.jpg", "pierre-cardin-rugan"),
        ("poster-27d14234.jpg", "pierre-cardin-poster"),
        ("pierre-cardin-vip-lansman-5228ef87.jpg", "pierre-cardin-rugan-yan"),
        ("pierre-cardin-vip-lansman-0ce827a8-9bbdfcc8.jpg", "pierre-cardin-vip-lansman"),
    ]:
        with Image.open(K / ad) as im:
            im.convert("RGB").save(MEVCUT / f"{hedef}.webp", "WEBP", quality=82, method=5)

    for f in sorted(MARKA.iterdir()):
        with Image.open(f) as im:
            print(f.relative_to(KOK), im.size)


if __name__ == "__main__":
    main()
