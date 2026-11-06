// Ekran görüntüsü aracı (Playwright). Sayfayı belirli kaydırma noktalarına götürüp
// görünür alanın görüntüsünü alır. Animasyonların oturması için her adımda bekler.
//
// Kullanım:
//   CHROME_PATH=... node scripts/ekran.mjs --cihaz masaustu --cikis docs/ekran \
//     --noktalar "acilis:0,acilis:0.5,ozet:0,markalar:0" [--url http://localhost:3500]
// Nokta biçimi: <bölüm id>:<bölüm içi kaydırma, ekran yüksekliği cinsinden> ya da y:<piksel>
// "acilis%<p>" açılış sahnesinin kaydırma ilerlemesi (0..1).

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const arg = (ad, vars) => {
  const i = process.argv.indexOf(`--${ad}`);
  return i > -1 ? process.argv[i + 1] : vars;
};

const cihazlar = {
  masaustu: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobil: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
};

const cihaz = arg("cihaz", "masaustu");
const url = arg("url", "http://localhost:3500/");
const cikis = arg("cikis", "docs/_kontrol/ekran");
const bekle = Number(arg("bekle", "1600"));
const azHareket = process.argv.includes("--az-hareket");
const noktalar = arg("noktalar", "acilis:0").split(",");
mkdirSync(cikis, { recursive: true });

const tarayici = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const baglam = await tarayici.newContext({
  ...cihazlar[cihaz],
  reducedMotion: azHareket ? "reduce" : "no-preference",
  locale: "tr-TR",
});
const sayfa = await baglam.newPage();
const hatalar = [];
sayfa.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") hatalar.push(`${m.type()}: ${m.text()}`);
});
sayfa.on("pageerror", (e) => hatalar.push(`pageerror: ${e.message}`));

await sayfa.goto(url, { waitUntil: "networkidle" });
await sayfa.waitForTimeout(1200);
// sahne yüklemesini tetikle (dokunmatikte ilk etkileşimde yüklenir)
await sayfa.mouse.move(700, 400);
await sayfa.evaluate(() => window.dispatchEvent(new Event("scroll")));
await sayfa.waitForTimeout(2500);

for (const n of noktalar) {
  const y = await sayfa.evaluate((n) => {
    const vh = window.innerHeight;
    if (n.startsWith("y:")) return Number(n.slice(2));
    if (n.startsWith("acilis%")) {
      const el = document.getElementById("acilis");
      const p = Number(n.slice(7));
      return el.offsetTop + p * (el.offsetHeight - vh);
    }
    const [id, ek] = n.split(":");
    const el = document.getElementById(id);
    if (!el) return 0;
    return el.getBoundingClientRect().top + window.scrollY + Number(ek || 0) * vh;
  }, n);
  // adım adım kaydır: kaydırmaya bağlı tetikleyiciler sırayla çalışsın
  const simdi = await sayfa.evaluate(() => window.scrollY);
  const adim = Math.max(1, Math.ceil(Math.abs(y - simdi) / 600));
  for (let i = 1; i <= adim; i++) {
    await sayfa.evaluate((yy) => window.scrollTo(0, yy), simdi + ((y - simdi) * i) / adim);
    await sayfa.waitForTimeout(60);
  }
  await sayfa.waitForTimeout(bekle);
  const gercek = await sayfa.evaluate(() => Math.round(window.scrollY));
  if (Math.abs(gercek - y) > 4) console.log(`uyarı: ${n} hedef ${Math.round(y)} gerçek ${gercek}`);
  const ad = `${cihaz}-${n.replace(/[:%.]/g, "_")}.png`;
  await sayfa.screenshot({ path: `${cikis}/${ad}` });
  console.log(`${cikis}/${ad}`);
}

if (hatalar.length) console.log("KONSOL:\n" + [...new Set(hatalar)].join("\n"));
await tarayici.close();
