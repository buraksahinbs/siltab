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

import numpy as np
from PIL import Image

KOK = Path(__file__).resolve().parent.parent
URUN = KOK / "public" / "urun"
TS = KOK / "content" / "urunler.ts"
ALFA = KOK / "public" / "urun-alfa"
OLCU = KOK / "docs" / "_kontrol" / "alfa-olcu.json"

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
    # okceli-s21 elendi: ikinci görselde taban altında açık renkli yansıma lekesi kalıyor
    ("spor", "spor", 1, [1, 2]),
    ("spor", "spor", 4, [1, 2, 3]),
    ("spor", "spor", 7, [1, 2, 3]),
]

KUCUK = 768


def baskin_renk(yol: Path) -> str:
    """Ürün piksellerinin (beyaz zemin dışı) medyan rengi: renk seçeneği noktası için."""
    with Image.open(yol) as im:
        a = np.asarray(im.convert("RGB").resize((300, 300), Image.BILINEAR)).reshape(-1, 3).astype(int)
    urun = a[a.min(axis=1) < 225]
    if len(urun) == 0:
        return "#cccccc"
    # gölgeleri ve parlak yansımaları at: algılanan malzeme rengi parlaklığın üst-orta bandında
    parlak = urun.mean(axis=1)
    alt, ust = np.percentile(parlak, [50, 90])
    orta = urun[(parlak >= alt) & (parlak <= ust)]
    r, g, b = np.median(orta if len(orta) else urun, axis=0).astype(int)
    return f"#{r:02x}{g:02x}{b:02x}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--budama", action="store_true")
    args = ap.parse_args()

    olcu = json.loads(OLCU.read_text()) if OLCU.exists() else {}
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
                {
                    "buyuk": f"/urun/{klasor}/{ad}.webp",
                    "kucuk": f"/urun/{klasor}/{ad}-{KUCUK}.webp",
                    "renk": baskin_renk(buyuk),
                    # saydam kesit (scripts/urun-alfa.py): ürün kare içinde alt kenara oturur
                    "alfa": f"/urun-alfa/{klasor}/{ad}.webp",
                    "alfaKucuk": f"/urun-alfa/{klasor}/{ad}-512.webp",
                    "genislik": olcu.get(ad, {}).get("genislik", 0.9),
                    "yukseklik": olcu.get(ad, {}).get("yukseklik", 0.9),
                }
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
        "export type UrunGorseli = {\n  buyuk: string;\n  kucuk: string;\n  /** baskın ürün rengi (renk noktası) */\n  renk: string;\n  /** saydam kesit 1024 px ve 512 px (ürün kare içinde alt kenara oturur) */\n  alfa: string;\n  alfaKucuk: string;\n  /** ürünün karedeki genişlik ve yükseklik payı (gölge boyutu için) */\n  genislik: number;\n  yukseklik: number;\n};",
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
