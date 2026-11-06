#!/usr/bin/env python3
"""kaynak/bayiler-ham.md dosyasını content/bayiler.json dosyasına çevirir.

Her kayıt: { il, bolge, ad, adres, telefon }
- il       : "İstanbul (Anadolu)" gibi bölgeli yazımlarda "İstanbul"
- bolge    : "Anadolu" / "Avrupa" ya da null
- telefon  : kaynakta yoksa null

Ham dosyadaki düzensizlikler:
- Bazı kayıtlarda telefon ile adres yer değiştirmiş ("0322 4586854 / Adana" + "GAZİ PAŞA BLV. NO:3").
- Bazı kayıtlarda koordinat parçası var (ör. "26.5604"); atılır.
- Dosya kaynağında kesilmiş ("truncated"). Kesik son kayıt (ili belli değil) atılır ve
  raporlanır. Ordu sonrasındaki iller listede yok.

Sayılar (bayi, il) bu dosyadan hesaplanır, elle yazılmaz.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / "kaynak" / "bayiler-ham.md"
CIKIS = KOK / "content" / "bayiler.json"

TELEFON = re.compile(r"^(?:\+?90\s*)?0?\d{3}\s*\d{3}\s*\d{2}\s*\d{2}$|^0\d{3}\s*\d{7}$")
KOORDINAT = re.compile(r"^\d{1,3}\.\d+$")
IL_ESLE = {"Hakkari": "Hakkâri"}


def telefon_mu(s: str) -> bool:
    return bool(TELEFON.match(s.strip())) or bool(re.fullmatch(r"[\d\s()+-]{10,}", s.strip()))


def telefon_bicim(s: str) -> str:
    rakam = re.sub(r"\D", "", s)
    if rakam.startswith("90") and len(rakam) == 12:
        rakam = "0" + rakam[2:]
    if len(rakam) == 11 and rakam.startswith("0"):
        return f"{rakam[:4]} {rakam[4:7]} {rakam[7:9]} {rakam[9:]}"
    return s.strip()


def il_ayir(s: str):
    """'ADRES / İl' biçiminden (adres, il) döndürür."""
    if " / " not in s:
        return None
    on, son = s.rsplit(" / ", 1)
    son = son.strip()
    if not son or re.search(r"\d", son):
        return None
    return on.strip(), son


def main() -> int:
    satirlar = HAM.read_text(encoding="utf-8").splitlines()
    kayitlar: list[dict] = []
    atilan: list[str] = []
    gecerli: dict | None = None

    def bitir(k: dict | None):
        if k is None:
            return
        il_ham = k.get("il_ham")
        if not il_ham:
            atilan.append(f"{k['ad']} (il yok, satırlar: {k['satirlar']})")
            return
        bolge = None
        m = re.match(r"^(.*?)\s*\((.*?)\)$", il_ham)
        il = il_ham
        if m:
            il, bolge = m.group(1), m.group(2)
        il = IL_ESLE.get(il, il)
        adres = ", ".join(x for x in k["adres"] if x) or None
        kayitlar.append(
            {
                "il": il,
                "bolge": bolge,
                "ad": k["ad"].strip(),
                "adres": adres,
                "telefon": telefon_bicim(k["telefon"]) if k["telefon"] else None,
            }
        )

    for ham in satirlar:
        s = ham.strip()
        if s.startswith("- ###"):
            bitir(gecerli)
            gecerli = {"ad": s[5:].strip(), "adres": [], "telefon": None, "il_ham": None, "satirlar": []}
            continue
        if gecerli is None or not s:
            continue
        if "truncated" in s:
            continue
        gecerli["satirlar"].append(s)
        if KOORDINAT.match(s):
            continue
        ayr = il_ayir(s)
        if ayr:
            on, il = ayr
            gecerli["il_ham"] = il
            if telefon_mu(on):
                gecerli["telefon"] = gecerli["telefon"] or on
            elif on.upper() != il.upper() and on.upper() not in ("", il.upper()):
                gecerli["adres"].insert(0, on)
            continue
        if telefon_mu(s):
            gecerli["telefon"] = gecerli["telefon"] or s
            continue
        # tekrar eden adres satırını alma
        if s not in gecerli["adres"]:
            gecerli["adres"].append(s)
    bitir(gecerli)

    CIKIS.parent.mkdir(parents=True, exist_ok=True)
    CIKIS.write_text(json.dumps(kayitlar, ensure_ascii=False, indent=1), encoding="utf-8")
    iller = sorted({k["il"] for k in kayitlar})
    print(f"{len(kayitlar)} bayi, {len(iller)} il/bölge adı")
    for a in atilan:
        print("atıldı:", a, file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
