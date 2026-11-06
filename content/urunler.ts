// Bu dosya scripts/urun-sec.py tarafından üretilir. Elle düzenleme.
// Görseller etiket ve fiyat metninden temizlenmiştir. Ürün adı, marka ve fiyat bilgisi yoktur.
// Aynı ürünün görselleri katalogdaki renk seçenekleridir.

export type KategoriKimligi =
  | "babet" | "bot" | "canta" | "comfort" | "deri" | "okceli" | "spor"
  /** yalnızca açılış sahnesi (katalog dışı) */
  | "erkek-klasik";

export type UrunGorseli = {
  buyuk: string;
  kucuk: string;
  /** baskın ürün rengi (renk noktası) */
  renk: string;
  /** saydam kesit 1024 px ve 512 px (ürün kare içinde alt kenara oturur) */
  alfa: string;
  alfaKucuk: string;
  /** ürünün karedeki genişlik ve yükseklik payı (gölge boyutu için) */
  genislik: number;
  yukseklik: number;
};

export type Urun = { id: string; kategori: KategoriKimligi; gorseller: UrunGorseli[] };

/** Katalogdan seçilen ürünler (koleksiyon şeridi ve açılış). */
export const urunler: Urun[] = [
  {
    "id": "babet-s01",
    "kategori": "babet",
    "gorseller": [
      {
        "buyuk": "/urun/babet/babet-s01-1.webp",
        "kucuk": "/urun/babet/babet-s01-1-768.webp",
        "renk": "#ac9e95",
        "alfa": "/urun-alfa/babet/babet-s01-1.webp",
        "alfaKucuk": "/urun-alfa/babet/babet-s01-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.3945
      },
      {
        "buyuk": "/urun/babet/babet-s01-2.webp",
        "kucuk": "/urun/babet/babet-s01-2-768.webp",
        "renk": "#5c4e4e",
        "alfa": "/urun-alfa/babet/babet-s01-2.webp",
        "alfaKucuk": "/urun-alfa/babet/babet-s01-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4141
      },
      {
        "buyuk": "/urun/babet/babet-s01-3.webp",
        "kucuk": "/urun/babet/babet-s01-3-768.webp",
        "renk": "#201f21",
        "alfa": "/urun-alfa/babet/babet-s01-3.webp",
        "alfaKucuk": "/urun-alfa/babet/babet-s01-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4541
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
        "renk": "#514545",
        "alfa": "/urun-alfa/babet/babet-s10-1.webp",
        "alfaKucuk": "/urun-alfa/babet/babet-s10-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4033
      },
      {
        "buyuk": "/urun/babet/babet-s10-2.webp",
        "kucuk": "/urun/babet/babet-s10-2-768.webp",
        "renk": "#b9a190",
        "alfa": "/urun-alfa/babet/babet-s10-2.webp",
        "alfaKucuk": "/urun-alfa/babet/babet-s10-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.3154
      },
      {
        "buyuk": "/urun/babet/babet-s10-3.webp",
        "kucuk": "/urun/babet/babet-s10-3-768.webp",
        "renk": "#403d41",
        "alfa": "/urun-alfa/babet/babet-s10-3.webp",
        "alfaKucuk": "/urun-alfa/babet/babet-s10-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.333
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
        "renk": "#27272a",
        "alfa": "/urun-alfa/babet/babet-s13-1.webp",
        "alfaKucuk": "/urun-alfa/babet/babet-s13-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.5127
      },
      {
        "buyuk": "/urun/babet/babet-s13-2.webp",
        "kucuk": "/urun/babet/babet-s13-2-768.webp",
        "renk": "#2b2b2f",
        "alfa": "/urun-alfa/babet/babet-s13-2.webp",
        "alfaKucuk": "/urun-alfa/babet/babet-s13-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.5479
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
        "renk": "#a0948d",
        "alfa": "/urun-alfa/bot/bot-s03-1.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s03-1-512.webp",
        "genislik": 0.8867,
        "yukseklik": 0.9004
      },
      {
        "buyuk": "/urun/bot/bot-s03-2.webp",
        "kucuk": "/urun/bot/bot-s03-2-768.webp",
        "renk": "#443938",
        "alfa": "/urun-alfa/bot/bot-s03-2.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s03-2-512.webp",
        "genislik": 0.8848,
        "yukseklik": 0.9004
      },
      {
        "buyuk": "/urun/bot/bot-s03-3.webp",
        "kucuk": "/urun/bot/bot-s03-3-768.webp",
        "renk": "#232226",
        "alfa": "/urun-alfa/bot/bot-s03-3.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s03-3-512.webp",
        "genislik": 0.8574,
        "yukseklik": 0.9004
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
        "renk": "#403838",
        "alfa": "/urun-alfa/bot/bot-s04-1.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s04-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.6982
      },
      {
        "buyuk": "/urun/bot/bot-s04-2.webp",
        "kucuk": "/urun/bot/bot-s04-2-768.webp",
        "renk": "#303033",
        "alfa": "/urun-alfa/bot/bot-s04-2.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s04-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.7051
      },
      {
        "buyuk": "/urun/bot/bot-s04-3.webp",
        "kucuk": "/urun/bot/bot-s04-3-768.webp",
        "renk": "#513631",
        "alfa": "/urun-alfa/bot/bot-s04-3.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s04-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.7266
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
        "renk": "#352421",
        "alfa": "/urun-alfa/bot/bot-s17-1.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s17-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.8789
      },
      {
        "buyuk": "/urun/bot/bot-s17-2.webp",
        "kucuk": "/urun/bot/bot-s17-2-768.webp",
        "renk": "#1b1a1d",
        "alfa": "/urun-alfa/bot/bot-s17-2.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s17-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.8975
      },
      {
        "buyuk": "/urun/bot/bot-s17-3.webp",
        "kucuk": "/urun/bot/bot-s17-3-768.webp",
        "renk": "#8d6c5a",
        "alfa": "/urun-alfa/bot/bot-s17-3.webp",
        "alfaKucuk": "/urun-alfa/bot/bot-s17-3-512.webp",
        "genislik": 0.8662,
        "yukseklik": 0.9004
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
        "renk": "#4d3839",
        "alfa": "/urun-alfa/canta-a/canta-a-s12-1.webp",
        "alfaKucuk": "/urun-alfa/canta-a/canta-a-s12-1-512.webp",
        "genislik": 0.7002,
        "yukseklik": 0.9004
      },
      {
        "buyuk": "/urun/canta-a/canta-a-s12-2.webp",
        "kucuk": "/urun/canta-a/canta-a-s12-2-768.webp",
        "renk": "#413838",
        "alfa": "/urun-alfa/canta-a/canta-a-s12-2.webp",
        "alfaKucuk": "/urun-alfa/canta-a/canta-a-s12-2-512.webp",
        "genislik": 0.7344,
        "yukseklik": 0.9004
      },
      {
        "buyuk": "/urun/canta-a/canta-a-s12-3.webp",
        "kucuk": "/urun/canta-a/canta-a-s12-3-768.webp",
        "renk": "#383b48",
        "alfa": "/urun-alfa/canta-a/canta-a-s12-3.webp",
        "alfaKucuk": "/urun-alfa/canta-a/canta-a-s12-3-512.webp",
        "genislik": 0.7178,
        "yukseklik": 0.9004
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
        "renk": "#bfaeaa",
        "alfa": "/urun-alfa/canta-b/canta-b-s26-1.webp",
        "alfaKucuk": "/urun-alfa/canta-b/canta-b-s26-1-512.webp",
        "genislik": 0.7285,
        "yukseklik": 0.9004
      },
      {
        "buyuk": "/urun/canta-b/canta-b-s26-2.webp",
        "kucuk": "/urun/canta-b/canta-b-s26-2-768.webp",
        "renk": "#2a292e",
        "alfa": "/urun-alfa/canta-b/canta-b-s26-2.webp",
        "alfaKucuk": "/urun-alfa/canta-b/canta-b-s26-2-512.webp",
        "genislik": 0.7256,
        "yukseklik": 0.9004
      },
      {
        "buyuk": "/urun/canta-b/canta-b-s26-3.webp",
        "kucuk": "/urun/canta-b/canta-b-s26-3-768.webp",
        "renk": "#6e4132",
        "alfa": "/urun-alfa/canta-b/canta-b-s26-3.webp",
        "alfaKucuk": "/urun-alfa/canta-b/canta-b-s26-3-512.webp",
        "genislik": 0.71,
        "yukseklik": 0.9004
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
        "renk": "#927769",
        "alfa": "/urun-alfa/canta-c/canta-c-s21-1.webp",
        "alfaKucuk": "/urun-alfa/canta-c/canta-c-s21-1-512.webp",
        "genislik": 0.7285,
        "yukseklik": 0.9004
      },
      {
        "buyuk": "/urun/canta-c/canta-c-s21-2.webp",
        "kucuk": "/urun/canta-c/canta-c-s21-2-768.webp",
        "renk": "#2a292e",
        "alfa": "/urun-alfa/canta-c/canta-c-s21-2.webp",
        "alfaKucuk": "/urun-alfa/canta-c/canta-c-s21-2-512.webp",
        "genislik": 0.7256,
        "yukseklik": 0.9004
      },
      {
        "buyuk": "/urun/canta-c/canta-c-s21-3.webp",
        "kucuk": "/urun/canta-c/canta-c-s21-3-768.webp",
        "renk": "#582e2d",
        "alfa": "/urun-alfa/canta-c/canta-c-s21-3.webp",
        "alfaKucuk": "/urun-alfa/canta-c/canta-c-s21-3-512.webp",
        "genislik": 0.7383,
        "yukseklik": 0.9004
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
        "renk": "#3e3333",
        "alfa": "/urun-alfa/comfort/comfort-s03-1.webp",
        "alfaKucuk": "/urun-alfa/comfort/comfort-s03-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.7324
      },
      {
        "buyuk": "/urun/comfort/comfort-s03-2.webp",
        "kucuk": "/urun/comfort/comfort-s03-2-768.webp",
        "renk": "#2a2a2e",
        "alfa": "/urun-alfa/comfort/comfort-s03-2.webp",
        "alfaKucuk": "/urun-alfa/comfort/comfort-s03-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.7178
      },
      {
        "buyuk": "/urun/comfort/comfort-s03-3.webp",
        "kucuk": "/urun/comfort/comfort-s03-3-768.webp",
        "renk": "#202023",
        "alfa": "/urun-alfa/comfort/comfort-s03-3.webp",
        "alfaKucuk": "/urun-alfa/comfort/comfort-s03-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.6973
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
        "renk": "#323135",
        "alfa": "/urun-alfa/comfort/comfort-s05-1.webp",
        "alfaKucuk": "/urun-alfa/comfort/comfort-s05-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4365
      },
      {
        "buyuk": "/urun/comfort/comfort-s05-2.webp",
        "kucuk": "/urun/comfort/comfort-s05-2-768.webp",
        "renk": "#4c3432",
        "alfa": "/urun-alfa/comfort/comfort-s05-2.webp",
        "alfaKucuk": "/urun-alfa/comfort/comfort-s05-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4639
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
        "renk": "#2c2b2e",
        "alfa": "/urun-alfa/comfort/comfort-s07-1.webp",
        "alfaKucuk": "/urun-alfa/comfort/comfort-s07-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4971
      },
      {
        "buyuk": "/urun/comfort/comfort-s07-2.webp",
        "kucuk": "/urun/comfort/comfort-s07-2-768.webp",
        "renk": "#3f393a",
        "alfa": "/urun-alfa/comfort/comfort-s07-2.webp",
        "alfaKucuk": "/urun-alfa/comfort/comfort-s07-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4727
      },
      {
        "buyuk": "/urun/comfort/comfort-s07-3.webp",
        "kucuk": "/urun/comfort/comfort-s07-3-768.webp",
        "renk": "#38383c",
        "alfa": "/urun-alfa/comfort/comfort-s07-3.webp",
        "alfaKucuk": "/urun-alfa/comfort/comfort-s07-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4766
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
        "renk": "#875c47",
        "alfa": "/urun-alfa/deri/deri-s05-1.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s05-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4258
      },
      {
        "buyuk": "/urun/deri/deri-s05-2.webp",
        "kucuk": "/urun/deri/deri-s05-2-768.webp",
        "renk": "#47352f",
        "alfa": "/urun-alfa/deri/deri-s05-2.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s05-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4854
      },
      {
        "buyuk": "/urun/deri/deri-s05-3.webp",
        "kucuk": "/urun/deri/deri-s05-3-768.webp",
        "renk": "#282426",
        "alfa": "/urun-alfa/deri/deri-s05-3.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s05-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4561
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
        "renk": "#383437",
        "alfa": "/urun-alfa/deri/deri-s08-1.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s08-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.7441
      },
      {
        "buyuk": "/urun/deri/deri-s08-2.webp",
        "kucuk": "/urun/deri/deri-s08-2-768.webp",
        "renk": "#313034",
        "alfa": "/urun-alfa/deri/deri-s08-2.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s08-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.707
      },
      {
        "buyuk": "/urun/deri/deri-s08-3.webp",
        "kucuk": "/urun/deri/deri-s08-3-768.webp",
        "renk": "#2a292c",
        "alfa": "/urun-alfa/deri/deri-s08-3.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s08-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.7373
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
        "renk": "#997f6d",
        "alfa": "/urun-alfa/deri/deri-s14-1.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s14-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4316
      },
      {
        "buyuk": "/urun/deri/deri-s14-2.webp",
        "kucuk": "/urun/deri/deri-s14-2-768.webp",
        "renk": "#403431",
        "alfa": "/urun-alfa/deri/deri-s14-2.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s14-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.459
      },
      {
        "buyuk": "/urun/deri/deri-s14-3.webp",
        "kucuk": "/urun/deri/deri-s14-3-768.webp",
        "renk": "#282628",
        "alfa": "/urun-alfa/deri/deri-s14-3.webp",
        "alfaKucuk": "/urun-alfa/deri/deri-s14-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4326
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
        "renk": "#3d3739",
        "alfa": "/urun-alfa/okceli/okceli-s03-1.webp",
        "alfaKucuk": "/urun-alfa/okceli/okceli-s03-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.6934
      },
      {
        "buyuk": "/urun/okceli/okceli-s03-2.webp",
        "kucuk": "/urun/okceli/okceli-s03-2-768.webp",
        "renk": "#343338",
        "alfa": "/urun-alfa/okceli/okceli-s03-2.webp",
        "alfaKucuk": "/urun-alfa/okceli/okceli-s03-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.6191
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
        "renk": "#423c3e",
        "alfa": "/urun-alfa/okceli/okceli-s09-1.webp",
        "alfaKucuk": "/urun-alfa/okceli/okceli-s09-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.6016
      },
      {
        "buyuk": "/urun/okceli/okceli-s09-2.webp",
        "kucuk": "/urun/okceli/okceli-s09-2-768.webp",
        "renk": "#816b60",
        "alfa": "/urun-alfa/okceli/okceli-s09-2.webp",
        "alfaKucuk": "/urun-alfa/okceli/okceli-s09-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.5752
      },
      {
        "buyuk": "/urun/okceli/okceli-s09-3.webp",
        "kucuk": "/urun/okceli/okceli-s09-3-768.webp",
        "renk": "#3d3d47",
        "alfa": "/urun-alfa/okceli/okceli-s09-3.webp",
        "alfaKucuk": "/urun-alfa/okceli/okceli-s09-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.6133
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
        "renk": "#c0b8b3",
        "alfa": "/urun-alfa/spor/spor-s01-1.webp",
        "alfaKucuk": "/urun-alfa/spor/spor-s01-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.5352
      },
      {
        "buyuk": "/urun/spor/spor-s01-2.webp",
        "kucuk": "/urun/spor/spor-s01-2-768.webp",
        "renk": "#67666a",
        "alfa": "/urun-alfa/spor/spor-s01-2.webp",
        "alfaKucuk": "/urun-alfa/spor/spor-s01-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.5137
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
        "renk": "#c1b6b1",
        "alfa": "/urun-alfa/spor/spor-s04-1.webp",
        "alfaKucuk": "/urun-alfa/spor/spor-s04-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4863
      },
      {
        "buyuk": "/urun/spor/spor-s04-2.webp",
        "kucuk": "/urun/spor/spor-s04-2-768.webp",
        "renk": "#cac5c0",
        "alfa": "/urun-alfa/spor/spor-s04-2.webp",
        "alfaKucuk": "/urun-alfa/spor/spor-s04-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4717
      },
      {
        "buyuk": "/urun/spor/spor-s04-3.webp",
        "kucuk": "/urun/spor/spor-s04-3-768.webp",
        "renk": "#d5cdc9",
        "alfa": "/urun-alfa/spor/spor-s04-3.webp",
        "alfaKucuk": "/urun-alfa/spor/spor-s04-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4814
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
        "renk": "#c9c0b9",
        "alfa": "/urun-alfa/spor/spor-s07-1.webp",
        "alfaKucuk": "/urun-alfa/spor/spor-s07-1-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4902
      },
      {
        "buyuk": "/urun/spor/spor-s07-2.webp",
        "kucuk": "/urun/spor/spor-s07-2-768.webp",
        "renk": "#969092",
        "alfa": "/urun-alfa/spor/spor-s07-2.webp",
        "alfaKucuk": "/urun-alfa/spor/spor-s07-2-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.5166
      },
      {
        "buyuk": "/urun/spor/spor-s07-3.webp",
        "kucuk": "/urun/spor/spor-s07-3-768.webp",
        "renk": "#2e2d30",
        "alfa": "/urun-alfa/spor/spor-s07-3.webp",
        "alfaKucuk": "/urun-alfa/spor/spor-s07-3-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.4854
      }
    ]
  }
];

/** Katalog dışı, yalnızca açılış sahnesinde kullanılan ürünler. */
export const ekUrunler: Urun[] = [
  {
    "id": "erkek-rugan",
    "kategori": "erkek-klasik",
    "gorseller": [
      {
        "buyuk": "/urun-alfa/erkek-rugan/erkek-rugan-kare.webp",
        "kucuk": "/urun-alfa/erkek-rugan/erkek-rugan-kare-768.webp",
        "renk": "#39393d",
        "alfa": "/urun-alfa/erkek-rugan/erkek-rugan-kare.webp",
        "alfaKucuk": "/urun-alfa/erkek-rugan/erkek-rugan-kare-512.webp",
        "genislik": 0.9004,
        "yukseklik": 0.3535
      }
    ]
  }
];
