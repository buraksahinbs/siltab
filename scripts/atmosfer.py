#!/usr/bin/env python3
"""Yapay zeka ile üretilmiş atmosfer görsellerini optimize eder.

Giriş : kaynak/gorsel/*.png  (üretim sürüyor olabilir; betik tekrar çalıştırılabilir)
Çıkış : public/atmosfer/<ad>-1600.webp ve <ad>-800.webp
        content/atmosfer.ts (ad, en, boy, yollar)

Bu görseller ürünün birebir kopyası değildir, temsilidir. Sitede ürün fotoğrafı
gibi sunulmaz.

Kullanım: .venv/bin/python -I scripts/atmosfer.py [--zorla]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image

KOK = Path(__file__).resolve().parent.parent
GIRIS = KOK / "kaynak" / "gorsel"
CIKIS = KOK / "public" / "atmosfer"
TS = KOK / "content" / "atmosfer.ts"
BOYUTLAR = (1600, 800)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--zorla", action="store_true")
    args = ap.parse_args()
    CIKIS.mkdir(parents=True, exist_ok=True)

    kayitlar = []
    for kaynak in sorted(GIRIS.glob("*.png")):
        ad = kaynak.stem
        with Image.open(kaynak) as im:
            im = im.convert("RGB")
            W, H = im.size
            yollar = {}
            for b in BOYUTLAR:
                hedef = CIKIS / f"{ad}-{b}.webp"
                yollar[b] = f"/atmosfer/{ad}-{b}.webp"
                if hedef.exists() and not args.zorla and hedef.stat().st_mtime >= kaynak.stat().st_mtime:
                    continue
                k = min(1.0, b / max(W, H))
                kucuk = im.resize((round(W * k), round(H * k)), Image.LANCZOS) if k < 1 else im
                kucuk.save(hedef, "WEBP", quality=80 if b > 1000 else 76, method=5)
                print("yazıldı", hedef.relative_to(KOK))
        k = min(1.0, BOYUTLAR[0] / max(W, H))
        kayitlar.append(
            {
                "ad": ad,
                "en": round(W * k),
                "boy": round(H * k),
                "buyuk": yollar[BOYUTLAR[0]],
                "kucuk": yollar[BOYUTLAR[1]],
            }
        )

    satirlar = [
        "// Bu dosya scripts/atmosfer.py tarafından üretilir. Elle düzenleme.",
        "// Yapay zeka ile üretilmiş temsili atmosfer görselleri. Ürün fotoğrafı değildir.",
        "",
        "export type AtmosferGorseli = { ad: string; en: number; boy: number; buyuk: string; kucuk: string };",
        "",
        "export const atmosferListesi: AtmosferGorseli[] = "
        + json.dumps(kayitlar, ensure_ascii=False, indent=2)
        + ";",
        "",
        "export const atmosfer = Object.fromEntries(atmosferListesi.map((g) => [g.ad, g])) as Record<string, AtmosferGorseli>;",
        "",
    ]
    TS.parent.mkdir(parents=True, exist_ok=True)
    TS.write_text("\n".join(satirlar), encoding="utf-8")
    print(f"{len(kayitlar)} görsel")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
