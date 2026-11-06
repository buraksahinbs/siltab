"use client";

/* eslint-disable react-hooks/immutability --
   three.js sahne nesneleri (malzeme uniform'ları, konumlar) her karede useFrame içinde
   React dışında değiştirilir. Bu, react-three-fiber'ın önerdiği kullanımdır; nesneler
   render sırasında değil, kare döngüsünde güncellenir. */

// Açılış sahnesinin WebGL katmanı (donanım hızlandırması olan cihazlarda CSS sahnesinin
// üstüne gelir). Koyu stüdyo, üstten spot ışığı, zeminde duran ürünler.
// Ürünlerin 3B modeli yok; her ürün saydam kesit (alfa) olarak bir düzleme basılır ve
// zemin üstünde kendi ekseni etrafında döner. Ön yüzde bir renk seçeneği, arka yüzde
// diğeri durur (arka yüz ayna görüntüsüdür: ürün dönmüş gibi görünür). Yan durumdan
// geçerken ürün yumuşakça söner ve diğer yüzüyle belirir. Zeminde temas gölgesi ve ince yansıma.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { cozumle, onYuzRengi, sahneDurumu, sahneYerlesimi } from "@/lib/sahne";

export type SahneKarti = { id: string; dokular: string[]; genislikler: number[] };

type Props = {
  kartlar: SahneKarti[];
  /** ilk ürünün dokuları yüklenince çağrılır */
  onHazir: () => void;
  /** sahne ekranda değilse çizim durur */
  aktif: boolean;
};

const KUTU = 2.6; // ürün karesinin kenarı (dünya birimi); ürün karenin altına oturur
const ARALIK = 2.9;
const DERINLIK = 2.6;
const ALT_PAY = 0.03; // kesitlerde ürünün altındaki boşluk (scripts/urun-alfa.py)
const FOV = 30;
const UZAKLIK = 7.2;

// ---------------------------------------------------------------- shaderlar

const urunVertex = /* glsl */ `
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

const urunFragment = /* glsl */ `
  uniform sampler2D uOn;
  uniform sampler2D uOn2;
  uniform float uKarisim;
  uniform sampler2D uArka;
  uniform float uParlaklik;
  uniform float uOpaklik;
  uniform float uYansima;
  uniform float uParilti;
  varying vec2 vUv;
  varying vec3 vDunya;
  varying vec3 vNormal;

  void main() {
    vec2 uv = vUv;
    vec4 t;
    if (gl_FrontFacing) {
      t = mix(texture2D(uOn, uv), texture2D(uOn2, uv), uKarisim);
    } else {
      t = texture2D(uArka, uv);
    }
    if (t.a < 0.004) discard;

    vec3 V = normalize(cameraPosition - vDunya);
    float yuz = abs(dot(normalize(vNormal), V));
    float gorunum = smoothstep(0.12, 0.42, yuz);

    vec3 c = t.rgb;
    float yukseklik = uYansima > 0.5 ? 1.0 - uv.y : uv.y;
    c *= mix(0.8, 1.06, smoothstep(0.0, 0.9, yukseklik));
    c *= vec3(1.025, 1.0, 0.965);
    float bant = exp(-pow((uv.x * 0.9 + uv.y * 0.35 - uParilti) * 4.0, 2.0));
    c += bant * 0.05 * t.a;
    c *= uParlaklik;

    float a = t.a * uOpaklik * gorunum;
    if (uYansima > 0.5) {
      float yakin = smoothstep(0.62, 1.0, uv.y);
      a *= 0.18 * yakin * yakin;
      c *= 0.75;
    }
    gl_FragColor = vec4(c, a);
    #include <colorspace_fragment>
  }
`;

const golgeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const golgeFragment = /* glsl */ `
  uniform float uOpaklik;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float genis = exp(-dot(p, p) * 3.2);
    vec2 q = p * vec2(1.25, 2.6);
    float cekirdek = exp(-dot(q, q) * 4.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, (genis * 0.5 + cekirdek * 0.6) * uOpaklik);
  }
`;

const zeminVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }
`;

const zeminFragment = /* glsl */ `
  uniform vec2 uCozunurluk;
  uniform vec2 uMerkez;
  uniform float uZemin;
  uniform float uGuc;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    float en = uCozunurluk.x / uCozunurluk.y;
    vec2 p = vUv;
    vec3 taban = vec3(0.0046, 0.0078, 0.0062);
    vec3 isik = vec3(0.92, 0.85, 0.74);

    float dx = abs(p.x - uMerkez.x) * en;
    float d = clamp((1.05 - p.y) / max(0.05, 1.05 - uZemin), 0.0, 1.0);
    float gen = 0.05 + d * 0.38;
    float koni = pow(clamp(1.0 - dx / gen, 0.0, 1.0), 1.6) * (0.35 + 0.65 * d);
    koni *= step(uZemin, p.y);

    float zemin = 1.0 - smoothstep(uZemin - 0.002, uZemin + 0.004, p.y);
    float zeminTon = zemin * (0.55 + 0.45 * smoothstep(0.0, uZemin, p.y));
    vec2 h = vec2((p.x - uMerkez.x) * en / 0.75, (p.y - uZemin) / 0.11);
    float havuz = exp(-dot(h, h) * 1.4) * zemin;

    vec2 v = (p - 0.5) * vec2(en, 1.0);
    float kenar = smoothstep(1.3, 0.2, length(v));

    vec3 c = taban * mix(0.55, 1.0, kenar);
    c += isik * (koni * 0.03 + havuz * 0.075 + zeminTon * 0.006) * uGuc;
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
  varying float vAlfa;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uZaman * 0.03 + aFaz * 3.0, 3.4);
    p.x += sin(uZaman * 0.18 + aFaz * 6.28) * 0.15;
    p.z += cos(uZaman * 0.15 + aFaz * 4.0) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aBoyut * uDpr * (5.0 / -mv.z);
    float uzak = length(p.xz);
    float koni = 1.0 - smoothstep(0.2, 0.9 + (3.4 - p.y) * 0.3, uzak);
    vAlfa = koni * (0.5 + 0.5 * sin(uZaman * 0.8 + aFaz * 30.0));
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
        gl.initTexture(t);
        coz(t);
      },
      undefined,
      reddet,
    );
  });
}

type UrunNesnesi = {
  grup: THREE.Group;
  mat: THREE.ShaderMaterial;
  yansimaMat: THREE.ShaderMaterial;
  golge: THREE.Mesh;
  golgeMat: THREE.ShaderMaterial;
  dokular: (THREE.Texture | null)[];
  gorunur: number;
  onSira: number;
  karisim: number;
};

function urunUret(renkSayisi: number, bos: THREE.Texture, geo: THREE.PlaneGeometry): UrunNesnesi {
  const ortak = {
    uOn: { value: bos as THREE.Texture },
    uOn2: { value: bos as THREE.Texture },
    uKarisim: { value: 1 },
    uArka: { value: bos as THREE.Texture },
    uParilti: { value: -2 },
  };
  const matUret = (yansima: boolean) =>
    new THREE.ShaderMaterial({
      vertexShader: urunVertex,
      fragmentShader: urunFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        ...ortak,
        uParlaklik: { value: 1 },
        uOpaklik: { value: 0 },
        uYansima: { value: yansima ? 1 : 0 },
      },
    });
  const mat = matUret(false);
  const yansimaMat = matUret(true);

  const urun = new THREE.Mesh(geo, mat);
  urun.position.y = KUTU / 2 - KUTU * ALT_PAY;
  urun.renderOrder = 2;
  const yansima = new THREE.Mesh(geo, yansimaMat);
  yansima.scale.y = -1;
  yansima.position.y = -KUTU / 2 + KUTU * ALT_PAY;
  yansima.renderOrder = 1;
  const grup = new THREE.Group();
  grup.add(urun, yansima);

  const golgeMat = new THREE.ShaderMaterial({
    vertexShader: golgeVertex,
    fragmentShader: golgeFragment,
    transparent: true,
    depthWrite: false,
    uniforms: { uOpaklik: { value: 0 } },
  });
  const golge = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), golgeMat);
  golge.rotation.x = -Math.PI / 2;
  golge.position.y = 0.004;

  return {
    grup,
    mat,
    yansimaMat,
    golge,
    golgeMat,
    dokular: new Array(renkSayisi).fill(null),
    gorunur: 0,
    onSira: 0,
    karisim: 1,
  };
}

function Sahne({ kartlar, onHazir }: Omit<Props, "aktif">) {
  const { gl, camera, size, scene } = useThree();
  const kokRef = useRef<THREE.Group>(null);
  const renkSayilari = useMemo(() => kartlar.map((k) => k.dokular.length), [kartlar]);

  const bos = useMemo(() => {
    const t = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
    t.needsUpdate = true;
    return t;
  }, []);
  const geo = useMemo(() => new THREE.PlaneGeometry(KUTU, KUTU), []);
  const nesneler = useMemo(() => kartlar.map((k) => urunUret(k.dokular.length, bos, geo)), [kartlar, bos, geo]);

  const zemin = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: zeminVertex,
      fragmentShader: zeminFragment,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uCozunurluk: { value: new THREE.Vector2(1, 1) },
        uMerkez: { value: new THREE.Vector2(0.5, 0.5) },
        uZemin: { value: 0.3 },
        uGuc: { value: 0 },
      },
    });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    m.frustumCulled = false;
    m.renderOrder = -10;
    return m;
  }, []);

  const toz = useMemo(() => {
    const adet = 36;
    const konum = new Float32Array(adet * 3);
    const boyut = new Float32Array(adet);
    const faz = new Float32Array(adet);
    let tohum = 11;
    const rastgele = () => {
      tohum = (tohum * 16807) % 2147483647;
      return (tohum - 1) / 2147483646;
    };
    for (let i = 0; i < adet; i++) {
      konum[i * 3] = (rastgele() - 0.5) * 3.6;
      konum[i * 3 + 1] = rastgele() * 3.4;
      konum[i * 3 + 2] = (rastgele() - 0.5) * 2.6;
      boyut[i] = 0.7 + rastgele() * 1.3;
      faz[i] = rastgele();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(konum, 3));
    g.setAttribute("aBoyut", new THREE.BufferAttribute(boyut, 1));
    g.setAttribute("aFaz", new THREE.BufferAttribute(faz, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: tozVertex,
      fragmentShader: tozFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uZaman: { value: 0 }, uDpr: { value: 1 }, uOpaklik: { value: 0 } },
    });
    const p = new THREE.Points(g, mat);
    p.frustumCulled = false;
    return p;
  }, []);

  useEffect(() => {
    let iptal = false;
    (async () => {
      for (let k = 0; k < kartlar.length; k++) {
        const yuklenen = await Promise.all(kartlar[k].dokular.map((u) => dokuYukle(u, gl).catch(() => null)));
        if (iptal) {
          yuklenen.forEach((t) => t?.dispose());
          return;
        }
        const n = nesneler[k];
        n.dokular = yuklenen;
        const ilk = yuklenen[0];
        if (ilk) {
          n.mat.uniforms.uOn.value = ilk;
          n.mat.uniforms.uOn2.value = ilk;
          n.mat.uniforms.uArka.value = yuklenen[1 % yuklenen.length] ?? ilk;
        }
        if (k === 0) onHazir();
      }
    })();
    return () => {
      iptal = true;
    };
  }, [kartlar, nesneler, gl, onHazir]);

  useEffect(() => {
    return () => {
      nesneler.forEach((n) => {
        n.mat.dispose();
        n.yansimaMat.dispose();
        n.golge.geometry.dispose();
        n.golgeMat.dispose();
        n.dokular.forEach((t) => t?.dispose());
      });
      geo.dispose();
      zemin.geometry.dispose();
      (zemin.material as THREE.Material).dispose();
      toz.geometry.dispose();
      (toz.material as THREE.Material).dispose();
      bos.dispose();
    };
  }, [nesneler, zemin, toz, bos, geo]);

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
    const acilis = Math.min(1, (z - gecici.baslangic) / 1.6);

    const s = sahneDurumu;
    const c = cozumle(s.deger, renkSayilari);
    const kam = camera as THREE.PerspectiveCamera;

    // yerleşim (CSS sahnesiyle ortak hesap): dünya birimine çevir
    const y = sahneYerlesimi(size.width, size.height);
    const gorH = 2 * UZAKLIK * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const birim = gorH / size.height; // piksel başına dünya birimi (z=0 düzleminde)
    const olcek = (y.kutu * birim) / KUTU;
    const sahneX = (y.merkezX - size.width / 2) * birim;
    const zeminY = (size.height / 2 - y.zeminY) * birim;
    kok.position.set(sahneX, zeminY, 0);
    kok.scale.setScalar(olcek);

    // kamera süzülmesi (CSS sahnesindeki ölçek ve kaymayla aynı ritim)
    kam.position.set(
      y.kameraX * birim + s.imlecX * 0.18,
      zeminY + KUTU * olcek * 0.42 + y.kameraY * birim - s.imlecY * 0.1,
      UZAKLIK / y.yaklasma,
    );
    gecici.hedefBak.set(y.kameraX * birim * 0.6, zeminY + KUTU * olcek * 0.42, 0);
    gecici.bak.lerp(gecici.hedefBak, 1 - Math.exp(-dt * 6));
    kam.lookAt(gecici.bak);

    for (let i = 0; i < nesneler.length; i++) {
      const n = nesneler[i];
      const d = i - c.odak;
      const ad = Math.abs(d);
      n.gorunur += ((n.dokular[0] ? 1 : 0) - n.gorunur) * (1 - Math.exp(-dt * 3));

      const x = Math.sign(d) * Math.min(ad, 2.4) * ARALIK * (1 - Math.min(ad, 1) * 0.1);
      const zDerin = -Math.pow(Math.min(ad, 2.4), 0.9) * DERINLIK;
      n.grup.position.set(x, 0, zDerin);
      n.golge.position.set(x, 0.004, zDerin);

      const yelpaze = -Math.sign(d) * Math.min(ad, 1.2) * 0.5;
      const girisDonus = c.asama === -1 && i === 0 ? -0.45 * (1 - c.giris) : 0;
      const odakta = 1 - Math.min(1, ad);
      const donus = c.donusler[i] + yelpaze + girisDonus + s.imlecX * 0.1 * odakta;
      n.grup.rotation.set(0, donus + Math.sin(z * 0.4 + i) * 0.015, 0);

      const sira = onYuzRengi(c.donusler[i], renkSayilari[i]);
      if (sira !== n.onSira && n.dokular[sira]) {
        n.mat.uniforms.uOn.value = n.mat.uniforms.uOn2.value;
        n.mat.uniforms.uOn2.value = n.dokular[sira];
        n.karisim = 0;
        n.onSira = sira;
      }
      n.karisim = Math.min(1, n.karisim + dt * 2.2);
      n.mat.uniforms.uKarisim.value = n.karisim;

      const parlak = (1 - Math.min(ad, 1.5) * 0.5) * (0.4 + 0.6 * acilis);
      // dinlenmede yalnızca odaktaki ürün görünür; komşular yalnızca geçişte belirir
        const sonma = Math.min(1, Math.max(0, ad - (d < 0 ? 0.4 : 0.5)) / 0.45);
      const opak = Math.max(0, n.gorunur * (1 - sonma));
      const parilti = ad < 0.5 ? ((c.donusler[i] / (Math.PI * 2)) % 1) * 2.6 - 0.8 : -2;
      for (const m of [n.mat, n.yansimaMat]) {
        m.uniforms.uParlaklik.value = parlak;
        m.uniforms.uOpaklik.value = opak;
      }
      n.mat.uniforms.uParilti.value = parilti;
      n.grup.visible = opak > 0.002;

      const gIdx = Math.cos(donus) >= 0 ? sira : 1 % renkSayilari[i];
      const gen = (kartlar[i].genislikler[gIdx] ?? 0.85) * KUTU;
      const cs = Math.abs(Math.cos(donus));
      n.golge.scale.set(gen * (0.45 + 0.55 * cs) + 0.25, 0.55 + gen * 0.25 * (1 - cs), 1);
      n.golgeMat.uniforms.uOpaklik.value = 0.75 * opak * (1 - Math.min(ad, 1) * 0.4);
      n.golge.visible = n.grup.visible;
    }

    const zm = zemin.material as THREE.ShaderMaterial;
    zm.uniforms.uCozunurluk.value.set(size.width, size.height);
    const merkez = gecici.v.set(sahneX, zeminY + KUTU * olcek * 0.6, 0).project(kam);
    zm.uniforms.uMerkez.value.set(merkez.x * 0.5 + 0.5, 0);
    const zeminEkran = gecici.v.set(sahneX, zeminY, 0).project(kam);
    zm.uniforms.uZemin.value = zeminEkran.y * 0.5 + 0.5;
    zm.uniforms.uGuc.value = acilis;

    const tm = toz.material as THREE.ShaderMaterial;
    tm.uniforms.uZaman.value = z;
    tm.uniforms.uDpr.value = state.viewport.dpr;
    tm.uniforms.uOpaklik.value = 0.4 * acilis;
  });

  return (
    <group ref={kokRef}>
      {nesneler.map((n, i) => (
        <group key={kartlar[i].id}>
          <primitive object={n.golge} />
          <primitive object={n.grup} />
        </group>
      ))}
      <primitive object={toz} />
    </group>
  );
}

export default function UrunSahnesi({ kartlar, onHazir, aktif }: Props) {
  return (
    <Canvas
      frameloop={aktif ? "always" : "never"}
      dpr={[1, 1.5]}
      flat
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: FOV, near: 0.1, far: 50, position: [0, 1, UZAKLIK] }}
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
