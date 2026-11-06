# Siltab site: geliştirme planı (aşamalı)

Bağlayıcı kaynak: `BRIEF.md`. Her aşama sonunda `npm run build` temiz, tür denetimi temiz, git commit. Bir aşama bitmeden diğerine geçme. Her aşamanın sonunda `docs/ILERLEME.md` dosyasına 3 satır durum yaz (ne bitti, ne kaldı, bilinen sorun).

## Aşama 1: Varlıklar ve iskelet
1. Next.js (App Router, TypeScript, Tailwind) iskeleti `site/` kökünde. Bağımlılıklar: three, @react-three/fiber, @react-three/drei, gsap, lenis.
2. Ürün görseli temizleme betiği `scripts/urun-temizle.py` (Python, Pillow ve numpy, venv `/home/hermes/work/siltab/venv` içinde pip ile kur): `/home/hermes/work/siltab/kaynak/drive/<kat>/*.jpeg` girişlerinden etiket ve fiyat metnini at, ürünü kırp, kare tuvale ortala, 1200 px webp olarak `public/urun/<kat>/<ad>.webp`. Ayrıca `content/urunler.ts` üret: kategori, ürün kimliği (sayfa), açı sayısı, dosya yolları. Etiketteki model kodunu çıkarma, sadece görseli kullan.
3. Temizleme kontrolü: ürünlerin 30 tanesinden bir temas sayfası (contact sheet) üret, `vision` yerine kendi gözünle bak, hâlâ metin kalan görseller için kuralı sıkılaştır. Metin içeren görsel yayına girmesin.
4. Üretilmiş atmosfer görselleri: `/home/hermes/work/gorsel/siltab/*.png` dosyalarını `public/atmosfer/` altına webp (1600 ve 800 px) olarak optimize et. Hâlâ üretiliyor olabilir, son dosya sayısına bakıp betiği yeniden çalıştırılabilir yaz.
5. Mevcut site varlıklarından logoları `public/marka/` altına koy.
6. Tasarım sistemi: renkler, tipografi, bileşenler (Header, Footer, Button, Section), `content/` metinleri.
7. Bayi verisi: `kaynak/bayiler-ham.md` dosyasını `content/bayiler.json` yap (il, ad, adres, telefon). Kaç bayi, kaç il olduğunu koddan hesapla.

## Aşama 2: Ana sayfa ve 3 boyutlu sahne
1. Açılış: tam ekran koyu stüdyo sahnesi, kaydırmaya bağlı ürün dönüşü (BRIEF 'Hareket ve 3 boyut' madde 1). Ürün açıları arasında shader geçişi.
2. Sahne yükleme: `dynamic import`, WebGL yoksa veya `prefers-reduced-motion` ise düz görsel yedeği, mobilde sınırlı texture ve DPR.
3. Ana sayfa bölümleri: açılış sahnesi, marka şeridi (üç marka, mankenli görsel), koleksiyon önizlemesi, kurumsal özet (2001'den beri), bayi sayacı, iletişim çağrısı.
4. Sürekli kaydırma ve geçiş animasyonları (Lenis, ScrollTrigger), ilerleme çubuğu.

## Aşama 3: İç sayfalar (İPTAL: BRIEF "Kapsam kararı", yalnızca tek sayfa landing)
Markalar (Pierre Cardin, Kuum London, Step More), Koleksiyon (kategori seçici ve şerit), Kurumsal (zaman çizelgesi), Haberler, Bayiler (il arama ve filtre), İletişim (form arayüzü), Tamir takip (form, demo sonuç), Bayi girişi arayüzü.

## Aşama 4: Cila ve doğrulama
1. SEO: başlıklar, açıklamalar, Open Graph, sitemap, robots, Organization verisi.
2. Erişilebilirlik ve klavye.
3. Lighthouse mobil ve masaüstü, sonuçları `docs/ILERLEME.md` dosyasına yaz, 80 altı performansı düzelt.
4. Playwright ile tüm sayfaların mobil ve masaüstü ekran görüntüsü (`docs/ekran/`), kendin bak, bozukları düzelt.
5. `docs/MUSTERIYE-SORULACAKLAR.md` dosyasını tamamla: ürünlerin markası, koleksiyon yayın izni ve fiyat gizliliği, Pierre Cardin lisans yılı (2006 mı 2008 mi), mankenli görsellerin temsili kullanımına onay, haber ve içerik güncelleme sahibi, alan adı ve barındırma.
