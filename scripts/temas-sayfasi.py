#!/usr/bin/env python3
"""Temizlenmiş ürün görsellerinden temas sayfası (contact sheet) üretir.

Kullanım: .venv/bin/python -I scripts/temas-sayfasi.py <cikis.jpg> [--adet 30] [--tohum 1] [--kat bot] [--alfa]
Her hücrenin altına dosya adı yazılır. Görsel kontrol içindir, yayına girmez.
"""
from __future__ import annotations

import argparse
import random
from pathlib import Path

from PIL import Image, ImageDraw

KOK = Path(__file__).resolve().parent.parent


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("cikis")
    ap.add_argument("--adet", type=int, default=30)
    ap.add_argument("--tohum", type=int, default=1)
    ap.add_argument("--kat", default="")
    ap.add_argument("--alfa", action="store_true")
    ap.add_argument("--sutun", type=int, default=6)
    ap.add_argument("--hucre", type=int, default=260)
    args = ap.parse_args()

    kok = KOK / "public" / ("urun-alfa" if args.alfa else "urun")
    dosyalar = sorted(kok.glob(f"{args.kat or '*'}/*.webp"))
    random.seed(args.tohum)
    if args.adet and args.adet < len(dosyalar):
        dosyalar = sorted(random.sample(dosyalar, args.adet))

    s, c = args.hucre, args.sutun
    r = (len(dosyalar) + c - 1) // c
    zemin = (40, 40, 40) if args.alfa else (200, 200, 200)
    sayfa = Image.new("RGB", (c * s, r * (s + 18)), zemin)
    d = ImageDraw.Draw(sayfa)
    for i, f in enumerate(dosyalar):
        im = Image.open(f)
        im.thumbnail((s - 6, s - 6))
        x, y = (i % c) * s, (i // c) * (s + 18)
        if im.mode == "RGBA":
            sayfa.paste(im, (x + 3, y + 3), im)
        else:
            sayfa.paste(im, (x + 3, y + 3))
        d.text((x + 4, y + s), f.stem, fill=(255, 255, 0) if args.alfa else (0, 0, 0))
    Path(args.cikis).parent.mkdir(parents=True, exist_ok=True)
    sayfa.save(args.cikis, quality=85)
    print(args.cikis, len(dosyalar))


if __name__ == "__main__":
    main()
