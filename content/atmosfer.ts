// Bu dosya scripts/atmosfer.py tarafından üretilir. Elle düzenleme.
// Yapay zeka ile üretilmiş temsili atmosfer görselleri. Ürün fotoğrafı değildir.

export type AtmosferGorseli = { ad: string; en: number; boy: number; buyuk: string; kucuk: string };

export const atmosferListesi: AtmosferGorseli[] = [
  {
    "ad": "hero-cift",
    "en": 1280,
    "boy": 720,
    "buyuk": "/atmosfer/hero-cift-1600.webp",
    "kucuk": "/atmosfer/hero-cift-800.webp"
  },
  {
    "ad": "m-bot",
    "en": 768,
    "boy": 1024,
    "buyuk": "/atmosfer/m-bot-1600.webp",
    "kucuk": "/atmosfer/m-bot-800.webp"
  },
  {
    "ad": "m-canta",
    "en": 768,
    "boy": 1024,
    "buyuk": "/atmosfer/m-canta-1600.webp",
    "kucuk": "/atmosfer/m-canta-800.webp"
  },
  {
    "ad": "m-erkek-ayakkabi",
    "en": 768,
    "boy": 1024,
    "buyuk": "/atmosfer/m-erkek-ayakkabi-1600.webp",
    "kucuk": "/atmosfer/m-erkek-ayakkabi-800.webp"
  },
  {
    "ad": "m-kuum-kadin",
    "en": 768,
    "boy": 1024,
    "buyuk": "/atmosfer/m-kuum-kadin-1600.webp",
    "kucuk": "/atmosfer/m-kuum-kadin-800.webp"
  },
  {
    "ad": "m-topuklu-oturan",
    "en": 768,
    "boy": 1024,
    "buyuk": "/atmosfer/m-topuklu-oturan-1600.webp",
    "kucuk": "/atmosfer/m-topuklu-oturan-800.webp"
  },
  {
    "ad": "x-ayakkabi-flatlay",
    "en": 1024,
    "boy": 768,
    "buyuk": "/atmosfer/x-ayakkabi-flatlay-1600.webp",
    "kucuk": "/atmosfer/x-ayakkabi-flatlay-800.webp"
  },
  {
    "ad": "x-bot-kapi",
    "en": 768,
    "boy": 1024,
    "buyuk": "/atmosfer/x-bot-kapi-1600.webp",
    "kucuk": "/atmosfer/x-bot-kapi-800.webp"
  },
  {
    "ad": "x-canta-masa",
    "en": 1024,
    "boy": 768,
    "buyuk": "/atmosfer/x-canta-masa-1600.webp",
    "kucuk": "/atmosfer/x-canta-masa-800.webp"
  },
  {
    "ad": "x-deri-makro",
    "en": 1280,
    "boy": 720,
    "buyuk": "/atmosfer/x-deri-makro-1600.webp",
    "kucuk": "/atmosfer/x-deri-makro-800.webp"
  },
  {
    "ad": "x-showroom",
    "en": 1280,
    "boy": 720,
    "buyuk": "/atmosfer/x-showroom-1600.webp",
    "kucuk": "/atmosfer/x-showroom-800.webp"
  },
  {
    "ad": "x-studio-koyu",
    "en": 1280,
    "boy": 720,
    "buyuk": "/atmosfer/x-studio-koyu-1600.webp",
    "kucuk": "/atmosfer/x-studio-koyu-800.webp"
  },
  {
    "ad": "x-taban-atolye",
    "en": 1280,
    "boy": 720,
    "buyuk": "/atmosfer/x-taban-atolye-1600.webp",
    "kucuk": "/atmosfer/x-taban-atolye-800.webp"
  },
  {
    "ad": "x-topuklu-yaprak",
    "en": 768,
    "boy": 1024,
    "buyuk": "/atmosfer/x-topuklu-yaprak-1600.webp",
    "kucuk": "/atmosfer/x-topuklu-yaprak-800.webp"
  }
];

export const atmosfer = Object.fromEntries(atmosferListesi.map((g) => [g.ad, g])) as Record<string, AtmosferGorseli>;
