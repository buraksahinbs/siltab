#!/usr/bin/env python3
"""Landing için seçilen ürünleri content/urunler.ts dosyasına yazar.

Seçim kuralı (BRIEF, Ürün seçimi kararı): kategori başına en fazla 3 ürün, toplam 20 ile 24,
ürün başına 2 ile 3 görsel. Seçim temas sayfalarına bakılarak elle yapıldı: etiket kalıntısı
olmayan, ışığı ve kadrajı temiz, sitenin sıcak paletine uyan modeller.

Not: Katalogda aynı sayfadaki görseller çoğunlukla aynı modelin farklı renkleridir
(farklı açılar değil). Sahnede bu görseller arasında geçiş yapılır.

Giriş : public/urun/<kat>/<ad>.webp (scripts/urun-temizle.py çıktısı, 1200 px)
Çıkış : public/urun/<kat>/<ad>-768.webp (mobil ve doku boyutu)
        content/urunler.ts
--budama : seçilmeyen görselleri public/urun altından siler.

Kullanım: .venv/bin/python -I scripts/urun-sec.py [--budama]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image

KOK = Path(__file__).resolve().parent.parent
URUN = KOK / "public" / "urun"
TS = KOK / "content" / "urunler.ts"

# (kategori, kaynak klasör, sayfa, görsel sıraları)
SECIM = [
    ("babet", "babet", 1, [1, 2, 3]),
    ("babet", "babet", 10, [1, 2, 3]),
    ("babet", "babet", 13, [1, 2]),
    ("bot", "bot", 3, [1, 2, 3]),
    ("bot", "bot", 4, [1, 2, 3]),
    ("bot", "bot", 17, [1, 2, 3]),
    ("canta", "canta-a", 12, [1, 2, 3]),
    ("canta", "canta-b", 26, [1, 2, 3]),
    ("canta", "canta-c", 21, [1, 2, 3]),
    ("comfort", "comfort", 3, [1, 2, 3]),
    ("comfort", "comfort", 5, [1, 2]),
    ("comfort", "comfort", 7, [1, 2, 3]),
    ("deri", "deri", 5, [1, 2, 3]),
    ("deri", "deri", 8, [1, 2, 3]),
    ("deri", "deri", 14, [1, 2, 3]),
    ("okceli", "okceli", 3, [1, 2]),
    ("okceli", "okceli", 9, [1, 2, 3]),
    ("okceli", "okceli", 21, [1, 2]),
    ("spor", "spor", 1, [1, 2]),
    ("spor", "spor", 4, [1, 2, 3]),
    ("spor", "spor", 7, [1, 2, 3]),
]

KUCUK = 768


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--budama", action="store_true")
    args = ap.parse_args()

    urunler = []
    gerekli: set[Path] = set()
    for kategori, klasor, sayfa, siralar in SECIM:
        gorseller = []
        for s in siralar:
            ad = f"{klasor}-s{sayfa:02d}-{s}"
            buyuk = URUN / klasor / f"{ad}.webp"
            kucuk = URUN / klasor / f"{ad}-{KUCUK}.webp"
            if not buyuk.exists():
                raise SystemExit(f"eksik görsel: {buyuk}")
            if not kucuk.exists() or kucuk.stat().st_mtime < buyuk.stat().st_mtime:
                with Image.open(buyuk) as im:
                    im.resize((KUCUK, KUCUK), Image.LANCZOS).save(kucuk, "WEBP", quality=80, method=5)
            gerekli.update({buyuk, kucuk})
            gorseller.append(
                {"buyuk": f"/urun/{klasor}/{ad}.webp", "kucuk": f"/urun/{klasor}/{ad}-{KUCUK}.webp"}
            )
        urunler.append({"id": f"{klasor}-s{sayfa:02d}", "kategori": kategori, "gorseller": gorseller})

    sayac: dict[str, int] = {}
    for u in urunler:
        sayac[u["kategori"]] = sayac.get(u["kategori"], 0) + 1
    assert all(v <= 3 for v in sayac.values()), sayac
    assert 20 <= len(urunler) <= 24, len(urunler)

    satirlar = [
        "// Bu dosya scripts/urun-sec.py tarafından üretilir. Elle düzenleme.",
        "// Görseller etiket ve fiyat metninden temizlenmiştir. Ürün adı, marka ve fiyat bilgisi yoktur.",
        "// Aynı ürünün görselleri katalogdaki renk seçenekleridir.",
        "",
        'export type KategoriKimligi = "babet" | "bot" | "canta" | "comfort" | "deri" | "okceli" | "spor";',
        "",
        "export type UrunGorseli = { buyuk: string; kucuk: string };",
        "",
        "export type Urun = { id: string; kategori: KategoriKimligi; gorseller: UrunGorseli[] };",
        "",
        "export const urunler: Urun[] = " + json.dumps(urunler, ensure_ascii=False, indent=2) + ";",
        "",
    ]
    TS.parent.mkdir(parents=True, exist_ok=True)
    TS.write_text("\n".join(satirlar), encoding="utf-8")
    print(f"{len(urunler)} ürün, {sum(len(u['gorseller']) for u in urunler)} görsel; {sayac}")

    if args.budama:
        silinen = 0
        for f in URUN.rglob("*.webp"):
            if f not in gerekli:
                f.unlink()
                silinen += 1
        for d in sorted(URUN.iterdir()):
            if d.is_dir() and not any(d.iterdir()):
                d.rmdir()
        alfa = KOK / "public" / "urun-alfa"
        if alfa.exists():
            for f in alfa.rglob("*"):
                if f.is_file():
                    f.unlink()
            for d in sorted(alfa.rglob("*"), reverse=True):
                d.rmdir()
            alfa.rmdir()
        print(f"budama: {silinen} görsel silindi")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
