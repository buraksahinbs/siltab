# İlerleme

## Aşama 1: Varlıklar ve iskelet
- Bitti: Next.js 16 (App Router, TS, Tailwind 4) iskeleti ve three, fiber, drei, gsap, lenis. Ürün temizleme betiği (`scripts/urun-temizle.py`, ürüne değen etiket satırlarını da silen harf grubu tespiti ve çıktıda otomatik metin denetimi), 661 görselin hepsi işlendi; brief'teki ürün seçimi kararıyla 21 ürün, 58 görsel seçildi (`scripts/urun-sec.py`, `content/urunler.ts`), kalanı yayından kaldırıldı. Atmosfer görselleri (`scripts/atmosfer.py`, 14 görsel, 1600 ve 800 px webp), logolar saydam zeminli (`scripts/logolar.py`), bayi verisi (`scripts/bayiler.py`, 865 bayi, 63 il ve Kıbrıs).
- Kalan: tasarım sistemi ve bileşenler Aşama 2 ile birlikte landing içinde kuruluyor (kapsam tek sayfaya indi).
- Bilinen sorun: bayi listesi kaynağında Ordu ilinde kesik. Saydam ürün kesitleri koyu zeminde beyaz hale bıraktığı için sahnede ürünler kendi zeminleriyle "kart" olarak kullanılıyor. Atmosfer görsellerinin özgün boyutu küçük (en çok 1280 px), tam ekran büyük monitörde hafif yumuşak görünebilir.
