# Siltab yeni web sitesi: BRIEF

Bu dosya bağlayıcıdır. Kararlar burada yazılıdır, değiştirme. Dil Türkçe. Metinlerde uzun tire, kısa tire, çift tire ve " - " ile cümle bölme kullanma. Emoji yok. Abartılı sıfat yok.

## Müşteri ve amaç

Siltab Group, Başakşehir İstanbul merkezli ayakkabı üreticisi ve lisans sahibi. Mevcut site (siltab.com.tr) 2017'den kalma, kuru ve bilgi vermiyor. Hedef: kurumsal güveni ve ürün kalitesini hissettiren, çok modern, kaydırdıkça ürünlerin 3 boyutlu sahnede döndüğü etkileyici bir site. Ziyaretçiler: bayiler ve bayi adayları (asıl hedef), tüketiciler, basın.

Kaynak bilgi (mevcut siteden, aynen kullan, uydurma ekleme):
- 2001'de İtalyan-Türk ortaklığıyla ayakkabı tabanı tasarlamak ve üretmek için kuruldu. 2004'te İtalyan ortaklardan ayrıldı, taban üretiminin yanında ayakkabı üretimine başladı.
- 2008: Pierre Cardin Erkek Ayakkabı Türkiye alt lisansörlüğü. 2016: Cacharel Erkek Ayakkabı Türkiye alt lisansörlüğü. 2018: Pierre Cardin VIP Exclusive koleksiyonu. 2021: Step More markasının Türkiye ayakkabı lisansörlüğü (Maison De Couture grubu, genç kadınlar için).
- Siltab, Pierre Cardin ile lisans anlaşması gereği Türkiye, İran, Irak ve Suriye'de lisans hakkına sahip (sitedeki ifade: "2006 tarihinde", kurumsal sayfada 2008. Çelişki var: sitede iki tarih geçiyor, kaynak olarak ikisini de belirt veya 2008'i kullan ve `docs/MUSTERIYE-SORULACAKLAR.md` dosyasına yaz).
- Pierre Cardin: 1950'de Fransa'da kuruldu, 140 ülke, 900 ürün lisansı, Türkiye'de Aydınlı Grup (1993). Metinleri `kaynak/siltab-mevcut` ve aşağıdaki sayfalardan al: kurumsal, pierre-cardin (özet olarak kısalt).
- İletişim: Ziya Gökalp Mah. Süleyman Demirel Bulvarı, Cumhuriyet Cad. No: 42 Sinpaş İş Modern Tic. Merkezi, 1. Etap EM Blok Çatıkatı İç Kapı No: E-58, Başakşehir / İstanbul. Tel +90 212 246 1320. E-posta info@siltab.com.tr. Sosyal: Instagram, Facebook, Twitter, LinkedIn, Pinterest (SiltabGroup).
- Haberler: "Yeni sezon Pierre Cardin şıklığı showroom'da", "Pierre Cardin VIP Exclusive lansman" (bayi toplantısı 06-10 Kasım 2024, Antalya, Elit Lara Hotel).
- Koleksiyon sayfaları (Pierre Cardin Kış 2026, Kuum London Kış 2026) mevcut sitede bayi girişi arkasında. Bayi girişi gerçek kimlik doğrulama yapmayacak, sadece arayüz taslağı (şifre talebi için telefon numarası göster).
- Bayi listesi: `kaynak/bayiler-ham.md` (il, bayi adı, adres, telefon). JSON'a çevir, ile göre filtrele, arama kutusu koy.
- Tamir takip sorgulama: irsaliye numarası ve güvenlik kodu formu (arayüz, gerçek sorgu yok, "yakında" değil, form çalışır ama sonuç demo durumu gösterir ve bunu açıkça belirtir).

## Görsel varlıklar

1. `public/urun/`: Drive'dan indirilmiş katalog kesitleri, `kaynak/katalog-index.json` (kat, sayfa, dosya, w, h). Kaynak klasör `/home/hermes/work/siltab/kaynak/drive/<kat>/<dosya>`. Kategoriler: babet, bot, canta-a, canta-b, canta-c, comfort, deri, okceli, spor. Her ürünün 2 ile 4 açıdan görseli var (`...-s03-1/2/3`, aynı sayfa numarası aynı ürün).
   - SORUN: Görsellerin içinde ürün kodu ve FİYAT etiketi yazılı (ör. "15-025 BEJ SATEN ÇNT05 999,99"). Bu fiyatlar bayi fiyatı olabilir ve kamuya açık sitede gösterilmemeli. Her görselden etiket metnini temizle: beyaz zeminde en büyük bağlantılı ürün bileşenini bul, etiket bileşenlerini at, ürünü kareye kırp, 1200 px, webp. Temizlenmemiş hiçbir görsel yayında olmasın. Temizleme sonrası 20 rastgele görseli gözle kontrol et.
   - Ürün adı ve fiyat gösterme. Etiketteki model kodu (ör. K45-710-1) istersen küçük bir "Model" etiketi olarak kullanılabilir, ama fiyat asla.
   - Ürünlerin hangi markaya ait olduğu bilinmiyor. Ürünleri markaya bağlama, sadece kategoriye bağla (Babet, Bot, Çanta, Comfort, Deri, Okçeli, Spor). Marka bilgisi `docs/MUSTERIYE-SORULACAKLAR.md` dosyasına soru olarak yazılsın.
2. `/home/hermes/work/gorsel/siltab/`: yapay zeka üretimi (ElevenLabs gpt-image-2.5) mankenli (`m-*.png`) ve mankensiz (`x-*.png`) atmosfer görselleri. Bunlar ürünün birebir kopyası DEĞİL. Ürün fotoğrafı gibi sunma. Kullanım: açılış, marka bölümleri, kurumsal, geçiş sahneleri, arka plan. Altyazı gerekirse "Görsel: temsili" notu footer'a. Tüm üretilmiş görselleri optimize et (webp, 2 boyut).
3. `kaynak/siltab-mevcut/`: mevcut sitenin logoları, slaytları, kapak görselleri. Pierre Cardin ve Kuum London logoları buradan (Kuum London logosu kırmızı, `page-2237732a.png`; Pierre Cardin `logo-pierre-cardin*.png`). Slaytları kullanma (kalite düşük, metin gömülü).

## Tasarım yönü

Lüks ama sıcak. Zemin kırık beyaz (#F6F2EC) ile koyu zümrüt-siyah (#0E1512) bölümlerin dönüşümü. Vurgu: Pierre Cardin için sıcak taba/bakır (#B07A4A), Kuum London için kırmızı (#E1111E, logodaki). Tipografi: başlıkta zarif serif (Fraunces veya Cormorant Garamond, next/font), gövdede Inter. Geniş boşluk, büyük tipografi, ince çizgiler. Mobilde de aynı kalite. Karanlık ve açık bölüm geçişleri kaydırmayla yumuşak olsun.

## Hareket ve 3 boyut (ana fark yaratan kısım)

Three.js, `@react-three/fiber` ve `@react-three/drei`, kaydırma için GSAP ScrollTrigger veya Lenis. Gerçek ürün 3D modeli (GLB) yok. Bu yüzden:
1. Açılış sahnesi: koyu stüdyo, spot ışığı altında dönen ürün kartları (gerçek ürün kesitleri, hafif eğim, yumuşak gölge, parçacık tozu). Kaydırdıkça kamera süzülür, ürünler 360 derece dönüp açıdan açıya geçer (aynı ürünün 2 ile 4 açılı fotoğrafı arasında kaydırmaya bağlı geçiş, shader ile karıştırma). Başlık metni sahneyle birlikte değişir.
2. Koleksiyon bölümü: kategori seçici (Babet, Bot, Çanta, Okçeli, Comfort, Spor, Deri). Her kategori için kaydırmaya bağlı, yatay akan 3 boyutlu ürün şeridi. Fareyle hafif paralaks ve eğilme (mobilde cihaz hareketi değil, dokunuşla).
3. Kurumsal: zaman çizelgesi (2001, 2004, 2008, 2016, 2018, 2021), kaydırmayla ilerleyen yatay çizgi, taban atölyesi ve deri makro görselleriyle.
4. Markalar: Pierre Cardin, Kuum London, Step More blokları, mankenli görsellerle tam ekran bölümler, yumuşak parallax.
5. Bayi bölümü: sayaç animasyonu (bayi sayısı kaynak listeden hesaplanır, uydurma sayı yok), il arama, il listesi.
6. Kaydırma ilerlemesi çubuğu, imleç etkileşimi, sayfa geçiş animasyonu.
Kurallar: `prefers-reduced-motion` desteği, WebGL yoksa düz görsel yedeği, mobil Lighthouse performans 80 üstü hedefi (ağır sahneyi sadece ana sayfada ve ekrana girince yükle, `dynamic import`, texture boyutlarını sınırla, DPR 1.5 üst sınırı), erişilebilirlik (klavye, alt metin, kontrast).

## Teknik

`/home/hermes/work/siltab/site` içinde Next.js (App Router), TypeScript, Tailwind. Veritabanı yok. İçerik `content/*.ts` ve `public/` altında statik. SEO: her sayfa için başlık, açıklama, Open Graph, sitemap, robots, yapılandırılmış veri (Organization). Sayfalar: Ana sayfa, Markalar (alt: Pierre Cardin, Kuum London, Step More), Koleksiyon, Kurumsal, Haberler, Bayiler, İletişim (form arayüzü, gönderme yok, sadece doğrulama ve teşekkür durumu), Tamir takip, Bayi girişi arayüzü. Hiçbir yerde sahte rakam, sahte yorum, sahte mağaza sayısı yok. Metin üretirken kaynak dışı iddia yazma; eksik bilgi için `docs/MUSTERIYE-SORULACAKLAR.md` dosyasına soru ekle.

Önizleme portu 3500 (başka süreçler 3100 ve 3400'ü kullanıyor, onları öldürme). `npm run build` ve test çıkışı temiz olmadan teslim etme. Her aşama sonunda git commit at.

## Kabul ölçütleri

- Ana sayfada kaydırmaya bağlı 3 boyutlu ürün sahnesi çalışır, 60 fps hedefi masaüstünde, mobilde akıcı.
- Hiçbir üründe fiyat veya etiket metni görünmez.
- Tüm sayfalar mobilde ve masaüstünde ekran görüntüsüyle kontrol edilir.
- Build ve tür denetimi hatasız.
- Lighthouse mobil performans raporu çıkarılır (CHROME_PATH=/home/hermes/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome), sayı BRIEF'e eklenir.

## Dosya yolu duzeltmesi (bağlayıcı)

Proje dizini dışına okuma yok. Tüm kaynaklar proje içine kopyalandı: ürün katalog kesitleri `kaynak/drive/<kat>/`, üretilmiş atmosfer görselleri `kaynak/gorsel/*.png` (hâlâ üretiliyor, yeni dosyalar `kaynak/gorsel/` altına eklenecek; son durumu `ls kaynak/gorsel` ile kontrol et, betik yeniden çalıştırılabilir olsun), mevcut site varlıkları `kaynak/siltab-mevcut/`, bayi listesi `kaynak/bayiler-ham.md`, katalog dizini `kaynak/katalog-index.json` (dosya yolları `_ham/<kat>/...`, gerçek yol `kaynak/drive/<kat>/...`). Python için kendi sanal ortamını proje içinde kur (`python3 -m venv .venv`, pillow ve numpy).

## Kalite standardı (Burak'ın açık talebi, bağlayıcı)

Yüzeysel, şablon veya "dandik" iş kabul edilmez. Müşteri mevcut siteden belirgin biçimde etkilenmeli. Her aşamada:
- Tipografi, boşluk, hizalama, renk kontrastı ve hareket zamanlaması piksel düzeyinde titizlikle ayarlanır. Varsayılan Tailwind görünümü, jenerik hero, stok kart ızgarası yok.
- Her sayfa mobil (390 px) ve masaüstü (1440 px) ekran görüntüsüyle gözle kontrol edilir, bozuk her şey düzeltilir. Kontrol etmeden aşamayı kapatma.
- 3 boyutlu sahne akıcı olmalı: takılma, siyah kare, texture patlaması, kesilmiş görsel yok. Kaydırma hızı ve easing elle ayarlanır.
- Kopyalanmış izlenimi veren yer tutucu metin, lorem ipsum, "yakında" yazısı yok. Metinler kaynak bilgiye dayanır, kısa, sakin, abartısız Türkçe.
- Ürün görsellerinde etiket ve fiyat kalıntısı sıfır. Bozuk veya düşük kalite görsel yayına girmez, elenir.
- Acele edip atlama yapma. Bir şey yapılamıyorsa sessizce geçme, `docs/ILERLEME.md` dosyasına yaz.

## Kapsam kararı (Burak'ın son talebi, önceki tüm sayfa listesinin yerine geçer)

Sadece TEK SAYFA landing yapılacak. İç sayfa yok (Markalar, Koleksiyon, Kurumsal, Haberler, Bayiler, İletişim, Tamir takip, Bayi girişi sayfaları YAPILMAYACAK). Bunların içeriği landing bölümlerine dönüşür: açılış 3D sahnesi, markalar (Pierre Cardin, Kuum London, Step More), koleksiyon (kategori seçici ve şerit), kurumsal ve zaman çizelgesi, bayi ağı (il arama, sayaç), iletişim bölümü ve form arayüzü. Tamir takip ve bayi girişi header'da küçük bağlantı olarak kalabilir, tıklayınca landing içinde basit bir modal açılır. Aşama 3 iptal, o zaman bütçesini ana sayfanın cilasına, hareket kalitesine ve ürün görsellerine harca. Tek sayfanın şaşırtıcı derecede iyi olması hedeftir. `docs/GELISTIRME.md` Aşama 3 maddeleri geçersizdir.

## Ton ve görsel dil kararı (Burak'ın son talebi, "Tasarım yönü" bölümünün ilgili kısımlarını geçersiz kılar)

Kurumsal, profesyonel, ciddi. Rengarenk veya "yapay zeka sloplu" görünüm yasak:
- Gradient buton, gradient metin, neon parlama, glassmorphism, renkli gölge halkaları, mor/mavi gradient zemin, emoji, ikon çorbası, dekoratif parıltı yok.
- Butonlar düz: tek renk dolgu veya ince çizgili, köşe yarıçapı küçük (0 ile 4 px), gölge yok veya çok hafif. Büyük yuvarlak "hap" butonlar yok.
- Palet kısıtlı: kırık beyaz, koyu zümrüt-siyah, tek vurgu olarak sıcak taba. Kuum London bölümünde logodaki kırmızı yalnızca o bölümde ve küçük dozda. Başka renk yok.
- Hareket zarif ve ölçülü: yumuşak easing, kısa mesafe, gösteriş için dönen/zıplayan öğe yok. 3 boyutlu sahne prestijli bir ürün sunumu gibi sakin olmalı (parçacık tozu çok seyrek ve belli belirsiz, abartılı efekt yok).
- Tipografi sakin: başlıkta zarif serif, gövdede Inter, büyük harf etiketlerde geniş harf aralığı. Ağır kalın başlıklar ve dev renkli rozetler yok.
- Metinler kısa, olgusal, abartısız. "Eşsiz, devrim, inanılmaz" gibi sıfatlar yok.
- İlham: lüks moda ve kurumsal marka siteleri (sade, boşluklu, editoryal). Kalabalık kart ızgarası ve renkli ikonlar yok.

## Ürün seçimi kararı (Burak'ın son talebi, bağlayıcı)

Tek sayfa landing için 661 görselin hepsi gerekmiyor. Temizleme ve kontrol işini DURDUR. Elinde temizlenmiş olanlardan, kategori başına en fazla 3 ürün (toplam 20 ile 24 ürün, ürün başına 2 ile 3 açı) en iyi ve en temiz olanları seç. Sadece bunları kullan, kalanı yok say, daha fazla zaman harcama. Seçimi `content/urunler.ts` dosyasına yaz. Hemen Aşama 2'ye (3 boyutlu ana sahne ve landing bölümleri) geç. Zamanın büyük kısmı sahneye, hareket kalitesine ve bölüm tasarımına gitsin.
