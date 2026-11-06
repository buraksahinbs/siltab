#!/usr/bin/env bash
# Görsel doğrulama: açılış sahnesinde ve bölümlerde kaydırma sırasında ekran görüntüsü alır,
# ardışık görüntüler arasındaki piksel farkını ve açık renk dikdörtgen olmadığını denetler.
# Kullanım: CHROME_PATH=... scripts/dogrula.sh [cikis_klasoru]
set -uo pipefail
SONUC=0
cd "$(dirname "$0")/.."
CIKIS="${1:-docs/_kontrol/dogrulama}"
rm -rf "$CIKIS"
PY=.venv/bin/python
NOKTA_ACILIS="acilis%0,acilis%0.12,acilis%0.25,acilis%0.4,acilis%0.55,acilis%0.7,acilis%0.85,acilis%1"
NOKTA_BOLUM="markalar:-0.6,markalar:0.6,koleksiyon:-0.5,koleksiyon:0.6,koleksiyon:2,kurumsal:-0.4,kurumsal:0.5,haberler:-0.3"

sira() { # verilen noktaları dosya adlarına çevir (sıra korunur)
  local cihaz=$1 klasor=$2 noktalar=$3
  IFS=',' read -ra N <<< "$noktalar"
  for n in "${N[@]}"; do echo "$klasor/$cihaz-$(echo "$n" | tr ':%.' '___').png"; done
}

for cihaz in masaustu mobil; do
  echo "== $cihaz: CSS sahnesi (WebGL yok ya da yüklenmeden önce)"
  node scripts/ekran.mjs --url http://localhost:3500/ --cihaz $cihaz --cikis "$CIKIS/css" --bekle 1800 --noktalar "$NOKTA_ACILIS" | grep -v "^$CIKIS" || true
  $PY -I scripts/dogrula.py $(sira $cihaz "$CIKIS/css" "$NOKTA_ACILIS") || SONUC=1
  echo "== $cihaz: WebGL sahnesi (zorlanmış)"
  node scripts/ekran.mjs --url "http://localhost:3500/?sahne=zorla" --cihaz $cihaz --cikis "$CIKIS/webgl" --bekle 3500 --noktalar "$NOKTA_ACILIS" | grep -v "^$CIKIS" || true
  $PY -I scripts/dogrula.py $(sira $cihaz "$CIKIS/webgl" "$NOKTA_ACILIS") || SONUC=1
  echo "== $cihaz: bölümler"
  node scripts/ekran.mjs --url http://localhost:3500/ --cihaz $cihaz --cikis "$CIKIS/bolum" --bekle 1500 --noktalar "$NOKTA_BOLUM" | grep -v "^$CIKIS" || true
  $PY -I scripts/dogrula.py $(sira $cihaz "$CIKIS/bolum" "$NOKTA_BOLUM") || SONUC=1
done
echo "GENEL SONUÇ: $([ $SONUC -eq 0 ] && echo geçti || echo SORUN VAR)"
exit $SONUC
