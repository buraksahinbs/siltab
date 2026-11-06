#!/usr/bin/env python3
"""Seçili ürün görsellerini gerçek alfa kesitine çevirir (beyaz zemin tamamen kalkar).

Giriş : public/urun/<kat>/<ad>.webp (etiketten temizlenmiş, beyaz zeminli 1200 px)
        Seçim scripts/urun-sec.py içindeki SECIM listesinden okunur.
Çıkış : public/urun-alfa/<kat>/<ad>.webp      (1024 px kare, saydam)
        public/urun-alfa/<kat>/<ad>-768.webp  (768 px kare, saydam; mobil sahne)
        public/urun-alfa/<kat>/<ad>-512.webp  (512 px kare, saydam; şerit)
        docs/_kontrol/alfa-olcu.json           (ürünün karedeki genişlik ve yükseklik payı)

Yöntem:
1. rembg (isnet-general-use) ile maske.
2. Maskeden küçük kopuk parçalar atılır, kenar 1 px aşındırılır ve hafifçe yumuşatılır.
3. Kenar renkleri beyazdan ayrıştırılır: yarı saydam piksellerde beyaz karışım geri
   çıkarılır, böylece koyu zeminde açık renk hale kalmaz.
4. Ürün sıkı kırpılır, kareye alt kenara oturtularak yerleştirilir (sahnede zemine basar).

Model dosyası proje içinde tutulur: U2NET_HOME=.venv/u2net
Kullanım: U2NET_HOME=.venv/u2net .venv/bin/python -I scripts/urun-alfa.py [--zorla]
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

KOK = Path(__file__).resolve().parent.parent
GIRIS = KOK / "public" / "urun"
CIKIS = KOK / "public" / "urun-alfa"
OLCU = KOK / "docs" / "_kontrol" / "alfa-olcu.json"
os.environ.setdefault("U2NET_HOME", str(KOK / ".venv" / "u2net"))

BOYUT = 1024
KUCUK = 512
DOLULUK = 0.9  # ürünün en uzun kenarının karedeki payı
ALT_PAY = 0.03  # alt kenar boşluğu


def secim_oku():
    spec = importlib.util.spec_from_file_location("urun_sec", KOK / "scripts" / "urun-sec.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m.SECIM


def isle(im: Image.Image, oturum) -> tuple[Image.Image, dict]:
    from rembg import remove

    rgba = remove(im.convert("RGB"), session=oturum, post_process_mask=True)
    a = np.asarray(rgba).astype(np.float32)
    alfa = a[..., 3] / 255.0

    # küçük kopuk parçaları at
    ikili = alfa > 0.35
    etiket, n = ndi.label(ikili)
    if n > 1:
        alanlar = ndi.sum(ikili, etiket, index=np.arange(1, n + 1))
        en_buyuk = alanlar.max()
        koru = np.isin(etiket, 1 + np.where(alanlar >= 0.04 * en_buyuk)[0])
        koru = ndi.binary_dilation(koru, iterations=3)
        alfa = alfa * koru

    # 1 px aşındır ve hafif yumuşat: kenardaki beyaz karışım bandı incelir
    ap = Image.fromarray((alfa * 255).astype(np.uint8))
    ap = ap.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    alfa = np.asarray(ap).astype(np.float32) / 255.0

    # renk ayrıştırma: I = a*C + (1-a)*beyaz  =>  C = (I - (1-a)*255) / a
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    al = np.clip(alfa, 1e-3, 1.0)[..., None]
    temiz = np.clip((rgb - (1.0 - al) * 255.0) / al, 0, 255)
    # neredeyse opak piksellerde özgün rengi koru (gürültü yükseltmesin)
    karisim = np.clip((alfa - 0.85) / 0.15, 0, 1)[..., None]
    temiz = temiz * (1 - karisim) + rgb * karisim

    cikis = np.dstack([temiz, alfa * 255]).astype(np.uint8)
    kesit = Image.fromarray(cikis, "RGBA")

    ys, xs = np.where(alfa > 0.04)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    kesit = kesit.crop((x0, y0, x1, y1))
    w, h = kesit.size
    k = (BOYUT * DOLULUK) / max(w, h)
    nw, nh = max(1, round(w * k)), max(1, round(h * k))
    kesit = kesit.resize((nw, nh), Image.LANCZOS)
    tuval = Image.new("RGBA", (BOYUT, BOYUT), (0, 0, 0, 0))
    ox = (BOYUT - nw) // 2
    oy = BOYUT - nh - round(BOYUT * ALT_PAY)
    tuval.paste(kesit, (ox, oy))
    return tuval, {"genislik": round(nw / BOYUT, 4), "yukseklik": round(nh / BOYUT, 4), "alt": ALT_PAY}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--zorla", action="store_true")
    args = ap.parse_args()
    from rembg import new_session

    oturum = new_session("isnet-general-use")
    olcu = json.loads(OLCU.read_text()) if OLCU.exists() else {}
    for _kat, klasor, sayfa, siralar in secim_oku():
        for s in siralar:
            ad = f"{klasor}-s{sayfa:02d}-{s}"
            giris = GIRIS / klasor / f"{ad}.webp"
            hedef = CIKIS / klasor / f"{ad}.webp"
            kucuk = CIKIS / klasor / f"{ad}-{KUCUK}.webp"
            if hedef.exists() and kucuk.exists() and ad in olcu and not args.zorla:
                continue
            with Image.open(giris) as im:
                tuval, o = isle(im, oturum)
            hedef.parent.mkdir(parents=True, exist_ok=True)
            tuval.save(hedef, "WEBP", quality=86, method=5, exact=False)
            tuval.resize((KUCUK, KUCUK), Image.LANCZOS).save(kucuk, "WEBP", quality=84, method=5)
            tuval.resize((768, 768), Image.LANCZOS).save(CIKIS / klasor / f"{ad}-768.webp", "WEBP", quality=84, method=5)
            olcu[ad] = o
            print("ok", ad, o)
    OLCU.parent.mkdir(parents=True, exist_ok=True)
    OLCU.write_text(json.dumps(olcu, indent=1))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
