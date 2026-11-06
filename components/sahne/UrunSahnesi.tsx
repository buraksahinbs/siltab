"use client";

/* eslint-disable react-hooks/immutability --
   three.js sahne nesneleri (malzeme uniform'ları, konumlar) her karede useFrame içinde
   React dışında değiştirilir. Bu, react-three-fiber'ın önerdiği kullanımdır; nesneler
   render sırasında değil, kare döngüsünde güncellenir. */

// Açılış sahnesi: koyu stüdyo, üstten spot ışığı, kaydırmayla dönen ürün kartları.
// Ürünlerin 3B modeli yok; her kart kalın bir baskı gibi ince bir kutudur. Ön yüzünde
// bir renk seçeneği, arka yüzünde diğeri durur. Kart dönerken ön yüzdeki doku,
// yüz kameradan uzaktayken değişir; böylece geçiş hiç görünmez.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { cozumle, onYuzRengi, sahneDurumu } from "@/lib/sahne";

export type SahneKarti = { id: string; dokular: string[] };

type Props = {
  kartlar: SahneKarti[];
  /** ilk kartın dokuları yüklenince çağrılır */
  onHazir: () => void;
  /** sahne ekranda değilse çizim durur */
  aktif: boolean;
};

const KART = 2.4; // kart kenarı (dünya birimi)
const KALINLIK = 0.02;
const ARALIK = 2.7; // kartlar arası yatay mesafe
const DERINLIK = 2.3; // odaktan uzaklaştıkça geri çekilme
const ZEMIN = -1.46; // zemin yüksekliği (kart altı -1.2)
const KAGIT = new THREE.Color("#f3eee6");
const KENAR = new THREE.Color("#cbc3b6");

// ---------------------------------------------------------------- shaderlar

const kartVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vDunya;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vec4 d = modelMatrix * vec4(position, 1.0);
    vDunya = d.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * d;
  }
`;

const kartFragment = /* glsl */ `
  uniform sampler2D uDoku;
  uniform sampler2D uDoku2;
  uniform float uKarisim;
  uniform vec3 uKagit;
  uniform float uParlaklik;
  uniform float uOpaklik;
  uniform float uParilti;
  uniform float uSpot;
  varying vec2 vUv;
  varying vec3 vDunya;
  varying vec3 vNormal;

  void main() {
    vec3 a = texture2D(uDoku, vUv).rgb;
    vec3 b = texture2D(uDoku2, vUv).rgb;
    vec3 c = mix(a, b, uKarisim) * uKagit;

    vec3 V = normalize(cameraPosition - vDunya);
    float yuz = clamp(dot(normalize(vNormal), V), 0.0, 1.0);

    // üstten gelen spot: kartın üstü biraz daha aydınlık; ışık merkezinden uzak kart sönük
    float dikey = mix(0.8, 1.04, smoothstep(0.0, 1.0, vUv.y));
    c *= dikey * uSpot * mix(0.38, 1.0, pow(yuz, 0.7));

    // dönüşte yüzeyden geçen çok hafif ışık bandı
    float bant = exp(-pow((vUv.x * 0.8 + vUv.y * 0.4 - uParilti) * 4.5, 2.0));
    c += bant * 0.035 * yuz;

    c *= uParlaklik;
    gl_FragColor = vec4(c, uOpaklik);
    #include <colorspace_fragment>
  }
`;

const golgeFragment = /* glsl */ `
  uniform float uOpaklik;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float a = pow(1.0 - smoothstep(0.0, 1.0, r), 2.2);
    gl_FragColor = vec4(0.0, 0.0, 0.0, a * uOpaklik);
  }
`;

const duzVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const zeminVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
`;

// Arka plan: ekran boyutunda dörtgen. Koyu zümrüt-siyah zemin, üstten yumuşak ışık konisi,
// zeminde ışık havuzu, kenarlarda hafif kararma, bantlaşmayı önleyen titreşim.
const zeminFragment = /* glsl */ `
  uniform vec2 uCozunurluk;
  uniform vec2 uMerkez;   // sahne merkezinin ekran konumu (0..1)
  uniform float uZemin;   // zeminin ekran yüksekliği (0..1)
  uniform float uGuc;     // ışık gücü (açılışta yavaşça yükselir)
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    float en = uCozunurluk.x / uCozunurluk.y;
    vec2 p = vUv;
    vec3 taban = vec3(0.0046, 0.0078, 0.0062);
    vec3 isik = vec3(0.90, 0.84, 0.74);

    // koni: tepeden aşağı genişler
    float dx = abs(p.x - uMerkez.x) * en;
    float derinlik = clamp(1.08 - p.y, 0.0, 1.2);
    float gen = 0.06 + derinlik * 0.42;
    float koni = pow(clamp(1.0 - dx / gen, 0.0, 1.0), 1.8);
    koni *= smoothstep(1.15, 0.35, derinlik) * 0.5 + smoothstep(0.0, 0.25, derinlik) * 0.5;
    koni *= step(uZemin - 0.02, p.y) * 0.85 + 0.15;

    // zemindeki ışık havuzu
    vec2 h = vec2((p.x - uMerkez.x) * en / 0.62, (p.y - uZemin) / 0.075);
    float havuz = exp(-dot(h, h) * 1.2);

    // kenar kararması
    vec2 v = (p - 0.5) * vec2(en, 1.0);
    float kenar = smoothstep(1.25, 0.25, length(v));

    vec3 c = taban * mix(0.6, 1.0, kenar);
    c += isik * (koni * 0.028 + havuz * 0.05) * uGuc;
    c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;

const tozVertex = /* glsl */ `
  attribute float aBoyut;
  attribute float aFaz;
  uniform float uZaman;
  uniform float uDpr;
  uniform vec3 uIsik;
  varying float vAlfa;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uZaman * 0.035 + aFaz * 3.0, 3.6) - 1.6;
    p.x += sin(uZaman * 0.2 + aFaz * 6.28) * 0.12;
    p.z += cos(uZaman * 0.17 + aFaz * 4.0) * 0.1;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aBoyut * uDpr * (5.5 / -mv.z);
    // yalnızca ışık konisinin içinde görünür
    float uzak = length(p.xz - uIsik.xz);
    float koni = 1.0 - smoothstep(0.3, 1.2 + (1.8 - p.y) * 0.35, uzak);
    float parilti = 0.55 + 0.45 * sin(uZaman * 0.9 + aFaz * 30.0);
    vAlfa = koni * parilti;
  }
`;

const tozFragment = /* glsl */ `
  uniform float uOpaklik;
  varying float vAlfa;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, r);
    gl_FragColor = vec4(vec3(0.95, 0.9, 0.82), a * vAlfa * uOpaklik);
    #include <colorspace_fragment>
  }
`;

// ---------------------------------------------------------------- doku yükleme

function dokuYukle(url: string, gl: THREE.WebGLRenderer): Promise<THREE.Texture> {
  return new Promise((coz, reddet) => {
    new THREE.TextureLoader().load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        t.generateMipmaps = true;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        gl.initTexture(t); // GPU'ya şimdi yükle: ilk dönüşte takılma olmasın
        coz(t);
      },
      undefined,
      reddet,
    );
  });
}

// ---------------------------------------------------------------- kart

type KartNesnesi = {
  grup: THREE.Group;
  kutu: THREE.Mesh;
  on: THREE.ShaderMaterial;
  arka: THREE.ShaderMaterial;
  kenar: THREE.MeshBasicMaterial;
  golge: THREE.Mesh;
  golgeMat: THREE.ShaderMaterial;
  dokular: (THREE.Texture | null)[];
  gorunur: number; // yüklenince 0'dan 1'e
  onSira: number;
  karisim: number;
  oncekiDoku: THREE.Texture | null;
};

function kartUret(renkSayisi: number, bos: THREE.Texture): KartNesnesi {
  const yuzMat = () =>
    new THREE.ShaderMaterial({
      vertexShader: kartVertex,
      fragmentShader: kartFragment,
      transparent: true,
      uniforms: {
        uDoku: { value: bos },
        uDoku2: { value: bos },
        uKarisim: { value: 0 },
        uKagit: { value: KAGIT.clone() },
        uParlaklik: { value: 1 },
        uOpaklik: { value: 0 },
        uParilti: { value: -1 },
        uSpot: { value: 1 },
      },
    });
  const on = yuzMat();
  const arka = yuzMat();
  const kenar = new THREE.MeshBasicMaterial({ color: KENAR.clone(), transparent: true, opacity: 0 });
  // BoxGeometry yüz sırası: +x, -x, +y, -y, +z (ön), -z (arka)
  const kutu = new THREE.Mesh(new THREE.BoxGeometry(KART, KART, KALINLIK), [kenar, kenar, kenar, kenar, on, arka]);
  const grup = new THREE.Group();
  grup.add(kutu);

  const golgeMat = new THREE.ShaderMaterial({
    vertexShader: duzVertex,
    fragmentShader: golgeFragment,
    transparent: true,
    depthWrite: false,
    uniforms: { uOpaklik: { value: 0 } },
  });
  const golge = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), golgeMat);
  golge.rotation.x = -Math.PI / 2;
  golge.renderOrder = -1;

  return {
    grup,
    kutu,
    on,
    arka,
    kenar,
    golge,
    golgeMat,
    dokular: new Array(renkSayisi).fill(null),
    gorunur: 0,
    onSira: 0,
    karisim: 1,
    oncekiDoku: null,
  };
}

// ---------------------------------------------------------------- sahne içi

function Sahne({ kartlar, onHazir }: Omit<Props, "aktif">) {
  const { gl, camera, size, scene } = useThree();
  const kokRef = useRef<THREE.Group>(null);
  const renkSayilari = useMemo(() => kartlar.map((k) => k.dokular.length), [kartlar]);

  const bos = useMemo(() => {
    const t = new THREE.DataTexture(new Uint8Array([243, 238, 230, 255]), 1, 1);
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, []);

  const nesneler = useMemo(() => kartlar.map((k) => kartUret(k.dokular.length, bos)), [kartlar, bos]);

  // arka plan
  const zemin = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: zeminVertex,
      fragmentShader: zeminFragment,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uCozunurluk: { value: new THREE.Vector2(1, 1) },
        uMerkez: { value: new THREE.Vector2(0.5, 0.5) },
        uZemin: { value: 0.2 },
        uGuc: { value: 0 },
      },
    });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    m.frustumCulled = false;
    m.renderOrder = -10;
    return m;
  }, []);

  // seyrek toz
  const toz = useMemo(() => {
    const adet = 70;
    const konum = new Float32Array(adet * 3);
    const boyut = new Float32Array(adet);
    const faz = new Float32Array(adet);
    let tohum = 7;
    const rastgele = () => {
      tohum = (tohum * 16807) % 2147483647;
      return (tohum - 1) / 2147483646;
    };
    for (let i = 0; i < adet; i++) {
      konum[i * 3] = (rastgele() - 0.5) * 4.2;
      konum[i * 3 + 1] = rastgele() * 3.6 - 1.6;
      konum[i * 3 + 2] = (rastgele() - 0.5) * 3.0;
      boyut[i] = 0.8 + rastgele() * 1.6;
      faz[i] = rastgele();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(konum, 3));
    geo.setAttribute("aBoyut", new THREE.BufferAttribute(boyut, 1));
    geo.setAttribute("aFaz", new THREE.BufferAttribute(faz, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: tozVertex,
      fragmentShader: tozFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uZaman: { value: 0 },
        uDpr: { value: 1 },
        uOpaklik: { value: 0 },
        uIsik: { value: new THREE.Vector3() },
      },
    });
    const p = new THREE.Points(geo, mat);
    p.frustumCulled = false;
    return p;
  }, []);

  // dokuları yükle: önce ilk kart, sonra sırayla diğerleri
  useEffect(() => {
    let iptal = false;
    (async () => {
      for (let k = 0; k < kartlar.length; k++) {
        const yuklenen = await Promise.all(
          kartlar[k].dokular.map((u) => dokuYukle(u, gl).catch(() => null)),
        );
        if (iptal) {
          yuklenen.forEach((t) => t?.dispose());
          return;
        }
        const n = nesneler[k];
        n.dokular = yuklenen;
        const ilk = yuklenen[0];
        if (ilk) {
          n.on.uniforms.uDoku.value = ilk;
          n.on.uniforms.uDoku2.value = ilk;
          const arka = yuklenen[1 % yuklenen.length] ?? ilk;
          n.arka.uniforms.uDoku.value = arka;
          n.arka.uniforms.uDoku2.value = arka;
        }
        if (k === 0) onHazir();
      }
    })();
    return () => {
      iptal = true;
    };
  }, [kartlar, nesneler, gl, onHazir]);

  // temizlik
  useEffect(() => {
    return () => {
      nesneler.forEach((n) => {
        n.kutu.geometry.dispose();
        n.on.dispose();
        n.arka.dispose();
        n.kenar.dispose();
        n.golge.geometry.dispose();
        n.golgeMat.dispose();
        n.dokular.forEach((t) => t?.dispose());
      });
      zemin.geometry.dispose();
      (zemin.material as THREE.Material).dispose();
      toz.geometry.dispose();
      (toz.material as THREE.Material).dispose();
      bos.dispose();
    };
  }, [nesneler, zemin, toz, bos]);

  useEffect(() => {
    scene.add(zemin);
    return () => {
      scene.remove(zemin);
    };
  }, [scene, zemin]);

  const gecici = useMemo(
    () => ({ v: new THREE.Vector3(), hedefBak: new THREE.Vector3(), bak: new THREE.Vector3(0, 0, 0), baslangic: -1 }),
    [],
  );

  useFrame((state, dt) => {
    const kok = kokRef.current;
    if (!kok) return;
    const z = state.clock.elapsedTime;
    if (gecici.baslangic < 0) gecici.baslangic = z;
    const acilis = Math.min(1, (z - gecici.baslangic) / 1.6); // ilk görünüşte ışığın yükselmesi

    // imleç sönümü
    const s = sahneDurumu;
    const k = 1 - Math.exp(-dt * 3);
    s.imlecX += (s.imlecHedefX - s.imlecX) * k;
    s.imlecY += (s.imlecHedefY - s.imlecY) * k;

    const c = cozumle(s.deger, renkSayilari);

    // yerleşim: yatay ekranda sahne sağda, dikey ekranda üstte ve küçük
    const en = size.width / Math.max(1, size.height);
    const kam = camera as THREE.PerspectiveCamera;
    const gorH = 2 * 6.6 * Math.tan(THREE.MathUtils.degToRad(kam.fov / 2));
    const gorW = gorH * en;
    const yatay = en > 1.05;
    const olcek = yatay
      ? Math.min(1, (gorH * 0.6) / KART)
      : Math.min(1, (gorW * 0.72) / KART, (gorH * 0.4) / KART);
    // metin sütunu solda: kartın sol kenarı ekran ortasının biraz sağında kalsın
    const sahneX = yatay ? Math.max(0.3 + (KART / 2) * olcek, Math.min(gorW * 0.25, 1.75)) : 0;
    // dikeyde kart üst bölümde: metin alt yarıda kalır
    const sahneY = yatay ? 0.02 : gorH * 0.5 - (KART * olcek) / 2 - gorH * 0.13;
    kok.position.set(sahneX, sahneY, 0);
    kok.scale.setScalar(olcek);

    // kamera: açılışta biraz uzakta, kaydırdıkça süzülerek yaklaşır
    const yaklas = 1 - Math.min(1, s.deger / 0.12);
    const ilerle = s.deger;
    kam.position.set(
      sahneX * 0.1 + Math.sin(ilerle * Math.PI * 2) * 0.18 + s.imlecX * 0.16,
      0.32 + yaklas * 0.25 - ilerle * 0.12 - s.imlecY * 0.1,
      6.6 + yaklas * 0.7,
    );
    gecici.hedefBak.set(sahneX * 0.08, -0.05, 0);
    gecici.bak.lerp(gecici.hedefBak, 1 - Math.exp(-dt * 4));
    kam.lookAt(gecici.bak);

    for (let i = 0; i < nesneler.length; i++) {
      const n = nesneler[i];
      const d = i - c.odak;
      const ad = Math.abs(d);
      const yuklu = n.dokular[0] != null;
      n.gorunur += ((yuklu ? 1 : 0) - n.gorunur) * (1 - Math.exp(-dt * 3));

      // odaktan uzaklaştıkça yana ve geriye
      const x = Math.sign(d) * Math.min(ad, 2.6) * ARALIK * (1 - Math.min(ad, 1) * 0.12);
      const zDerin = -Math.pow(Math.min(ad, 2.6), 0.9) * DERINLIK;
      const yuzme = Math.sin(z * 0.55 + i * 1.7) * 0.035;
      n.grup.position.set(x, yuzme, zDerin);

      const yelpaze = -Math.sign(d) * Math.min(ad, 1.2) * 0.42;
      const donus = c.donusler[i] + (c.asama === -1 && i === 0 ? -0.32 * (1 - c.giris) : 0);
      const odakta = 1 - Math.min(1, ad);
      n.grup.rotation.set(
        s.imlecY * 0.05 * odakta + Math.sin(z * 0.4 + i) * 0.012,
        donus + yelpaze + s.imlecX * 0.08 * odakta,
        Math.sin(z * 0.33 + i * 2.1) * 0.008,
      );

      // ön yüz dokusu: yüz kameradan uzaktayken değişir; değişim anında yumuşak karışım
      const sira = onYuzRengi(c.donusler[i], renkSayilari[i]);
      if (sira !== n.onSira && n.dokular[sira]) {
        const onceki = n.on.uniforms.uDoku2.value as THREE.Texture;
        n.on.uniforms.uDoku.value = onceki;
        n.on.uniforms.uDoku2.value = n.dokular[sira];
        n.karisim = 0;
        n.onSira = sira;
      }
      n.karisim = Math.min(1, n.karisim + dt * 2.2);
      n.on.uniforms.uKarisim.value = n.karisim;

      const parlak = (1 - Math.min(ad, 1.5) * 0.6) * (0.35 + 0.65 * acilis);
      // geçmiş kartlar (solda, metnin arkası) hızla söner; gelecek kartlar sağda sönük bekler
      const sonma = d < 0 ? Math.min(1, Math.max(0, ad - 0.45) / 0.55) : Math.min(1, Math.max(0, ad - 1.25) / 0.6);
      const opak = n.gorunur * (1 - sonma);
      const parilti = (((c.donusler[i] / (Math.PI * 2)) % 1) * 2.4 - 0.7) * (ad < 0.5 ? 1 : 0) - (ad < 0.5 ? 0 : 1);
      for (const m of [n.on, n.arka]) {
        m.uniforms.uParlaklik.value = parlak;
        m.uniforms.uOpaklik.value = Math.max(0, opak);
        m.uniforms.uParilti.value = parilti;
        m.uniforms.uSpot.value = 1 - Math.min(1, ad / 2.2) * 0.5;
      }
      n.kenar.color.copy(KENAR).multiplyScalar(parlak * 0.75);
      n.kenar.opacity = Math.max(0, opak);
      n.grup.visible = opak > 0.002;

      // gölge: kartın zemine izdüşümü, dönüşle daralır
      const genis = Math.abs(Math.cos(n.grup.rotation.y)) * KART * 0.92 + 0.35;
      n.golge.position.set(x, ZEMIN, zDerin);
      n.golge.scale.set(genis, 0.75, 1);
      n.golgeMat.uniforms.uOpaklik.value = 0.62 * Math.max(0, opak) * (1 - Math.min(ad, 1) * 0.5);
      n.golge.visible = n.grup.visible;
    }

    // arka plan ışık konumları
    const zm = zemin.material as THREE.ShaderMaterial;
    zm.uniforms.uCozunurluk.value.set(size.width, size.height);
    const merkezEkran = gecici.v.set(sahneX, sahneY, 0).project(kam);
    zm.uniforms.uMerkez.value.set(merkezEkran.x * 0.5 + 0.5, 0);
    const zeminEkran = gecici.v.set(sahneX, sahneY + ZEMIN * olcek, 0).project(kam);
    zm.uniforms.uZemin.value = zeminEkran.y * 0.5 + 0.5;
    zm.uniforms.uMerkez.value.y = merkezEkran.y * 0.5 + 0.5;
    zm.uniforms.uGuc.value = acilis;

    const tm = toz.material as THREE.ShaderMaterial;
    tm.uniforms.uZaman.value = z;
    tm.uniforms.uDpr.value = state.viewport.dpr;
    tm.uniforms.uOpaklik.value = 0.55 * acilis;
    (tm.uniforms.uIsik.value as THREE.Vector3).set(0, 0, 0);
  });

  return (
    <group ref={kokRef}>
      {nesneler.map((n, i) => (
        <group key={kartlar[i].id}>
          <primitive object={n.grup} />
          <primitive object={n.golge} />
        </group>
      ))}
      <primitive object={toz} />
    </group>
  );
}

// ---------------------------------------------------------------- tuval

export default function UrunSahnesi({ kartlar, onHazir, aktif }: Props) {
  return (
    <Canvas
      frameloop={aktif ? "always" : "never"}
      dpr={[1, 1.5]}
      flat
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 30, near: 0.1, far: 40, position: [0, 0.4, 7.3] }}
      onCreated={({ gl }) => {
        gl.setClearColor("#0e1512", 1);
      }}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
    >
      <Sahne kartlar={kartlar} onHazir={onHazir} />
    </Canvas>
  );
}
