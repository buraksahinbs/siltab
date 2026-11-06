// Bu dosya scripts/urun-sec.py tarafından üretilir. Elle düzenleme.
// Görseller etiket ve fiyat metninden temizlenmiştir. Ürün adı, marka ve fiyat bilgisi yoktur.
// Aynı ürünün görselleri katalogdaki renk seçenekleridir.

export type KategoriKimligi = "babet" | "bot" | "canta" | "comfort" | "deri" | "okceli" | "spor";

export type UrunGorseli = { buyuk: string; kucuk: string; /** baskın ürün rengi (renk noktası) */ renk: string };

export type Urun = { id: string; kategori: KategoriKimligi; gorseller: UrunGorseli[] };

export const urunler: Urun[] = [
  {
    "id": "babet-s01",
    "kategori": "babet",
    "gorseller": [
      {
        "buyuk": "/urun/babet/babet-s01-1.webp",
        "kucuk": "/urun/babet/babet-s01-1-768.webp",
        "renk": "#ac9e95"
      },
      {
        "buyuk": "/urun/babet/babet-s01-2.webp",
        "kucuk": "/urun/babet/babet-s01-2-768.webp",
        "renk": "#5c4e4e"
      },
      {
        "buyuk": "/urun/babet/babet-s01-3.webp",
        "kucuk": "/urun/babet/babet-s01-3-768.webp",
        "renk": "#201f21"
      }
    ]
  },
  {
    "id": "babet-s10",
    "kategori": "babet",
    "gorseller": [
      {
        "buyuk": "/urun/babet/babet-s10-1.webp",
        "kucuk": "/urun/babet/babet-s10-1-768.webp",
        "renk": "#514545"
      },
      {
        "buyuk": "/urun/babet/babet-s10-2.webp",
        "kucuk": "/urun/babet/babet-s10-2-768.webp",
        "renk": "#b9a190"
      },
      {
        "buyuk": "/urun/babet/babet-s10-3.webp",
        "kucuk": "/urun/babet/babet-s10-3-768.webp",
        "renk": "#403d41"
      }
    ]
  },
  {
    "id": "babet-s13",
    "kategori": "babet",
    "gorseller": [
      {
        "buyuk": "/urun/babet/babet-s13-1.webp",
        "kucuk": "/urun/babet/babet-s13-1-768.webp",
        "renk": "#27272a"
      },
      {
        "buyuk": "/urun/babet/babet-s13-2.webp",
        "kucuk": "/urun/babet/babet-s13-2-768.webp",
        "renk": "#2b2b2f"
      }
    ]
  },
  {
    "id": "bot-s03",
    "kategori": "bot",
    "gorseller": [
      {
        "buyuk": "/urun/bot/bot-s03-1.webp",
        "kucuk": "/urun/bot/bot-s03-1-768.webp",
        "renk": "#a0948d"
      },
      {
        "buyuk": "/urun/bot/bot-s03-2.webp",
        "kucuk": "/urun/bot/bot-s03-2-768.webp",
        "renk": "#443938"
      },
      {
        "buyuk": "/urun/bot/bot-s03-3.webp",
        "kucuk": "/urun/bot/bot-s03-3-768.webp",
        "renk": "#232226"
      }
    ]
  },
  {
    "id": "bot-s04",
    "kategori": "bot",
    "gorseller": [
      {
        "buyuk": "/urun/bot/bot-s04-1.webp",
        "kucuk": "/urun/bot/bot-s04-1-768.webp",
        "renk": "#403838"
      },
      {
        "buyuk": "/urun/bot/bot-s04-2.webp",
        "kucuk": "/urun/bot/bot-s04-2-768.webp",
        "renk": "#303033"
      },
      {
        "buyuk": "/urun/bot/bot-s04-3.webp",
        "kucuk": "/urun/bot/bot-s04-3-768.webp",
        "renk": "#513631"
      }
    ]
  },
  {
    "id": "bot-s17",
    "kategori": "bot",
    "gorseller": [
      {
        "buyuk": "/urun/bot/bot-s17-1.webp",
        "kucuk": "/urun/bot/bot-s17-1-768.webp",
        "renk": "#352421"
      },
      {
        "buyuk": "/urun/bot/bot-s17-2.webp",
        "kucuk": "/urun/bot/bot-s17-2-768.webp",
        "renk": "#1b1a1d"
      },
      {
        "buyuk": "/urun/bot/bot-s17-3.webp",
        "kucuk": "/urun/bot/bot-s17-3-768.webp",
        "renk": "#8d6c5a"
      }
    ]
  },
  {
    "id": "canta-a-s12",
    "kategori": "canta",
    "gorseller": [
      {
        "buyuk": "/urun/canta-a/canta-a-s12-1.webp",
        "kucuk": "/urun/canta-a/canta-a-s12-1-768.webp",
        "renk": "#4d3839"
      },
      {
        "buyuk": "/urun/canta-a/canta-a-s12-2.webp",
        "kucuk": "/urun/canta-a/canta-a-s12-2-768.webp",
        "renk": "#413838"
      },
      {
        "buyuk": "/urun/canta-a/canta-a-s12-3.webp",
        "kucuk": "/urun/canta-a/canta-a-s12-3-768.webp",
        "renk": "#383b48"
      }
    ]
  },
  {
    "id": "canta-b-s26",
    "kategori": "canta",
    "gorseller": [
      {
        "buyuk": "/urun/canta-b/canta-b-s26-1.webp",
        "kucuk": "/urun/canta-b/canta-b-s26-1-768.webp",
        "renk": "#bfaeaa"
      },
      {
        "buyuk": "/urun/canta-b/canta-b-s26-2.webp",
        "kucuk": "/urun/canta-b/canta-b-s26-2-768.webp",
        "renk": "#2a292e"
      },
      {
        "buyuk": "/urun/canta-b/canta-b-s26-3.webp",
        "kucuk": "/urun/canta-b/canta-b-s26-3-768.webp",
        "renk": "#6e4132"
      }
    ]
  },
  {
    "id": "canta-c-s21",
    "kategori": "canta",
    "gorseller": [
      {
        "buyuk": "/urun/canta-c/canta-c-s21-1.webp",
        "kucuk": "/urun/canta-c/canta-c-s21-1-768.webp",
        "renk": "#927769"
      },
      {
        "buyuk": "/urun/canta-c/canta-c-s21-2.webp",
        "kucuk": "/urun/canta-c/canta-c-s21-2-768.webp",
        "renk": "#2a292e"
      },
      {
        "buyuk": "/urun/canta-c/canta-c-s21-3.webp",
        "kucuk": "/urun/canta-c/canta-c-s21-3-768.webp",
        "renk": "#582e2d"
      }
    ]
  },
  {
    "id": "comfort-s03",
    "kategori": "comfort",
    "gorseller": [
      {
        "buyuk": "/urun/comfort/comfort-s03-1.webp",
        "kucuk": "/urun/comfort/comfort-s03-1-768.webp",
        "renk": "#3e3333"
      },
      {
        "buyuk": "/urun/comfort/comfort-s03-2.webp",
        "kucuk": "/urun/comfort/comfort-s03-2-768.webp",
        "renk": "#2a2a2e"
      },
      {
        "buyuk": "/urun/comfort/comfort-s03-3.webp",
        "kucuk": "/urun/comfort/comfort-s03-3-768.webp",
        "renk": "#202023"
      }
    ]
  },
  {
    "id": "comfort-s05",
    "kategori": "comfort",
    "gorseller": [
      {
        "buyuk": "/urun/comfort/comfort-s05-1.webp",
        "kucuk": "/urun/comfort/comfort-s05-1-768.webp",
        "renk": "#323135"
      },
      {
        "buyuk": "/urun/comfort/comfort-s05-2.webp",
        "kucuk": "/urun/comfort/comfort-s05-2-768.webp",
        "renk": "#4c3432"
      }
    ]
  },
  {
    "id": "comfort-s07",
    "kategori": "comfort",
    "gorseller": [
      {
        "buyuk": "/urun/comfort/comfort-s07-1.webp",
        "kucuk": "/urun/comfort/comfort-s07-1-768.webp",
        "renk": "#2c2b2e"
      },
      {
        "buyuk": "/urun/comfort/comfort-s07-2.webp",
        "kucuk": "/urun/comfort/comfort-s07-2-768.webp",
        "renk": "#3f393a"
      },
      {
        "buyuk": "/urun/comfort/comfort-s07-3.webp",
        "kucuk": "/urun/comfort/comfort-s07-3-768.webp",
        "renk": "#38383c"
      }
    ]
  },
  {
    "id": "deri-s05",
    "kategori": "deri",
    "gorseller": [
      {
        "buyuk": "/urun/deri/deri-s05-1.webp",
        "kucuk": "/urun/deri/deri-s05-1-768.webp",
        "renk": "#875c47"
      },
      {
        "buyuk": "/urun/deri/deri-s05-2.webp",
        "kucuk": "/urun/deri/deri-s05-2-768.webp",
        "renk": "#47352f"
      },
      {
        "buyuk": "/urun/deri/deri-s05-3.webp",
        "kucuk": "/urun/deri/deri-s05-3-768.webp",
        "renk": "#282426"
      }
    ]
  },
  {
    "id": "deri-s08",
    "kategori": "deri",
    "gorseller": [
      {
        "buyuk": "/urun/deri/deri-s08-1.webp",
        "kucuk": "/urun/deri/deri-s08-1-768.webp",
        "renk": "#383437"
      },
      {
        "buyuk": "/urun/deri/deri-s08-2.webp",
        "kucuk": "/urun/deri/deri-s08-2-768.webp",
        "renk": "#313034"
      },
      {
        "buyuk": "/urun/deri/deri-s08-3.webp",
        "kucuk": "/urun/deri/deri-s08-3-768.webp",
        "renk": "#2a292c"
      }
    ]
  },
  {
    "id": "deri-s14",
    "kategori": "deri",
    "gorseller": [
      {
        "buyuk": "/urun/deri/deri-s14-1.webp",
        "kucuk": "/urun/deri/deri-s14-1-768.webp",
        "renk": "#997f6d"
      },
      {
        "buyuk": "/urun/deri/deri-s14-2.webp",
        "kucuk": "/urun/deri/deri-s14-2-768.webp",
        "renk": "#403431"
      },
      {
        "buyuk": "/urun/deri/deri-s14-3.webp",
        "kucuk": "/urun/deri/deri-s14-3-768.webp",
        "renk": "#282628"
      }
    ]
  },
  {
    "id": "okceli-s03",
    "kategori": "okceli",
    "gorseller": [
      {
        "buyuk": "/urun/okceli/okceli-s03-1.webp",
        "kucuk": "/urun/okceli/okceli-s03-1-768.webp",
        "renk": "#3d3739"
      },
      {
        "buyuk": "/urun/okceli/okceli-s03-2.webp",
        "kucuk": "/urun/okceli/okceli-s03-2-768.webp",
        "renk": "#343338"
      }
    ]
  },
  {
    "id": "okceli-s09",
    "kategori": "okceli",
    "gorseller": [
      {
        "buyuk": "/urun/okceli/okceli-s09-1.webp",
        "kucuk": "/urun/okceli/okceli-s09-1-768.webp",
        "renk": "#423c3e"
      },
      {
        "buyuk": "/urun/okceli/okceli-s09-2.webp",
        "kucuk": "/urun/okceli/okceli-s09-2-768.webp",
        "renk": "#816b60"
      },
      {
        "buyuk": "/urun/okceli/okceli-s09-3.webp",
        "kucuk": "/urun/okceli/okceli-s09-3-768.webp",
        "renk": "#3d3d47"
      }
    ]
  },
  {
    "id": "okceli-s21",
    "kategori": "okceli",
    "gorseller": [
      {
        "buyuk": "/urun/okceli/okceli-s21-1.webp",
        "kucuk": "/urun/okceli/okceli-s21-1-768.webp",
        "renk": "#a69081"
      },
      {
        "buyuk": "/urun/okceli/okceli-s21-2.webp",
        "kucuk": "/urun/okceli/okceli-s21-2-768.webp",
        "renk": "#3e3d40"
      }
    ]
  },
  {
    "id": "spor-s01",
    "kategori": "spor",
    "gorseller": [
      {
        "buyuk": "/urun/spor/spor-s01-1.webp",
        "kucuk": "/urun/spor/spor-s01-1-768.webp",
        "renk": "#c0b8b3"
      },
      {
        "buyuk": "/urun/spor/spor-s01-2.webp",
        "kucuk": "/urun/spor/spor-s01-2-768.webp",
        "renk": "#67666a"
      }
    ]
  },
  {
    "id": "spor-s04",
    "kategori": "spor",
    "gorseller": [
      {
        "buyuk": "/urun/spor/spor-s04-1.webp",
        "kucuk": "/urun/spor/spor-s04-1-768.webp",
        "renk": "#c1b6b1"
      },
      {
        "buyuk": "/urun/spor/spor-s04-2.webp",
        "kucuk": "/urun/spor/spor-s04-2-768.webp",
        "renk": "#cac5c0"
      },
      {
        "buyuk": "/urun/spor/spor-s04-3.webp",
        "kucuk": "/urun/spor/spor-s04-3-768.webp",
        "renk": "#d5cdc9"
      }
    ]
  },
  {
    "id": "spor-s07",
    "kategori": "spor",
    "gorseller": [
      {
        "buyuk": "/urun/spor/spor-s07-1.webp",
        "kucuk": "/urun/spor/spor-s07-1-768.webp",
        "renk": "#c9c0b9"
      },
      {
        "buyuk": "/urun/spor/spor-s07-2.webp",
        "kucuk": "/urun/spor/spor-s07-2-768.webp",
        "renk": "#969092"
      },
      {
        "buyuk": "/urun/spor/spor-s07-3.webp",
        "kucuk": "/urun/spor/spor-s07-3-768.webp",
        "renk": "#2e2d30"
      }
    ]
  }
];
