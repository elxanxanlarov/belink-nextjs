"use client";

import QRCode from "qrcode";

const W = 1200;
const H = 1500;
const BURGUNDY = "#8b1424";
const RED = "#c8102e";
const CREAM = "#fdf6f0";
const INK = "#2a1416";
let SANS = "Arial, sans-serif";

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function heartPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.9);
  ctx.bezierCurveTo(cx - s * 1.6, cy - s * 0.2, cx - s * 0.7, cy - s * 1.4, cx, cy - s * 0.45);
  ctx.bezierCurveTo(cx + s * 0.7, cy - s * 1.4, cx + s * 1.6, cy - s * 0.2, cx, cy + s * 0.9);
  ctx.closePath();
}

function drawBow(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = RED;
  ctx.strokeStyle = BURGUNDY;
  ctx.lineWidth = 3;
  // Loops
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(dir * 40, -70, dir * 120, -60, dir * 110, -10);
    ctx.bezierCurveTo(dir * 105, 25, dir * 50, 20, 0, 0);
    ctx.fill();
    ctx.stroke();
  }
  // Tails
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(dir * 20, 50, dir * 40, 90, dir * 60, 130);
    ctx.lineTo(dir * 40, 125);
    ctx.lineTo(dir * 30, 140);
    ctx.bezierCurveTo(dir * 15, 95, dir * 5, 50, 0, 5);
    ctx.fill();
    ctx.stroke();
  }
  // Knot
  ctx.beginPath();
  ctx.ellipse(0, 2, 18, 15, 0, 0, Math.PI * 2);
  ctx.fillStyle = BURGUNDY;
  ctx.fill();
  ctx.restore();
}

function drawGiftLogo(ctx: CanvasRenderingContext2D, cx: number, top: number) {
  // Kiçik hədiyyə qutusu + ürək
  const bw = 120;
  const bh = 80;
  const bx = cx - bw / 2;
  const by = top + 40;
  ctx.fillStyle = RED;
  roundRect(ctx, bx, by, bw, bh, 10);
  ctx.fill();
  ctx.fillStyle = BURGUNDY;
  roundRect(ctx, bx - 10, by - 22, bw + 20, 28, 8);
  ctx.fill();
  ctx.fillStyle = "#fff";
  heartPath(ctx, cx, by + 40, 46);
  ctx.fill();
  ctx.fillStyle = RED;
  heartPath(ctx, cx, by + 40, 34);
  ctx.fill();
  // Kiçik fiyonk
  drawBow(ctx, cx, by - 24, 0.35);

  ctx.fillStyle = BURGUNDY;
  ctx.font = `italic 800 92px ${SANS}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Etiraf", cx, by + bh + 105);
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, bend: number) {
  ctx.strokeStyle = BURGUNDY;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  const mx = (x1 + x2) / 2 + bend;
  const my = (y1 + y2) / 2 - Math.abs(bend);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(mx, my, x2, y2);
  ctx.stroke();
  const angle = Math.atan2(y2 - my, x2 - mx);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 22 * Math.cos(angle - 0.5), y2 - 22 * Math.sin(angle - 0.5));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 22 * Math.cos(angle + 0.5), y2 - 22 * Math.sin(angle + 0.5));
  ctx.stroke();
}

function drawOutlineHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.strokeStyle = RED;
  ctx.lineWidth = 4;
  heartPath(ctx, cx, cy, size);
  ctx.stroke();
}

function drawQr(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
  const count = qr.modules.size;
  const cell = size / count;
  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);

  // Mərkəzdəki ürək üçün boş saxlanılan sahə (H səviyyəsi ~30% bərpa edir, biz ~8% örtürük)
  const hole = Math.round(count * 0.24) | 1;
  const holeStart = Math.floor((count - hole) / 2);
  const inHole = (r: number, c: number) =>
    r >= holeStart && r < holeStart + hole && c >= holeStart && c < holeStart + hole;

  ctx.fillStyle = INK;
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.modules.get(r, c) || isFinder(r, c) || inHole(r, c)) continue;
      roundRect(ctx, x + c * cell + cell * 0.06, y + r * cell + cell * 0.06, cell * 0.88, cell * 0.88, cell * 0.22);
      ctx.fill();
    }
  }

  // Yumru künclü göz nöqtələri
  for (const [fr, fc] of [[0, 0], [0, count - 7], [count - 7, 0]] as const) {
    const fx = x + fc * cell;
    const fy = y + fr * cell;
    ctx.fillStyle = INK;
    roundRect(ctx, fx, fy, cell * 7, cell * 7, cell * 1.8);
    ctx.fill();
    ctx.fillStyle = "#fff";
    roundRect(ctx, fx + cell, fy + cell, cell * 5, cell * 5, cell * 1.3);
    ctx.fill();
    ctx.fillStyle = INK;
    roundRect(ctx, fx + cell * 2, fy + cell * 2, cell * 3, cell * 3, cell * 0.9);
    ctx.fill();
  }

  // Mərkəzdə ürək
  const hx = x + holeStart * cell;
  const hy = y + holeStart * cell;
  const hs = hole * cell;
  ctx.fillStyle = "#fff";
  roundRect(ctx, hx, hy, hs, hs, hs * 0.22);
  ctx.fill();
  ctx.fillStyle = RED;
  heartPath(ctx, hx + hs / 2, hy + hs / 2 + hs * 0.04, hs * 0.62);
  ctx.fill();
}

function drawPhoneIcon(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 5;
  roundRect(ctx, x, y, 52, 88, 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 18, y + 76);
  ctx.lineTo(x + 34, y + 76);
  ctx.stroke();
}

async function ensureFonts(script: string) {
  if (typeof document === "undefined") return;
  // Sayt şrifti next/font tərəfindən heşlənmiş adla yüklənir — real adı body-dən götürürük.
  SANS = getComputedStyle(document.body).fontFamily || SANS;
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`64px ${script}`, "Sənin üçün"),
      document.fonts.load(`italic 800 92px ${SANS}`, "Etiraf"),
    ]);
  } catch {
    // Şrift yüklənməsə, sistem şrifti istifadə olunur.
  }
}

/**
 * Etiraf hədiyyə kartını (QR ilə) canvas üzərində çəkir.
 * @param scriptFont əl yazısı şriftinin CSS adı (next/font-dan gəlir)
 */
export async function renderEtirafQrCard(url: string, scriptFont: string): Promise<HTMLCanvasElement> {
  await ensureFonts(scriptFont);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Arxa fon (çap üçün ağ)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Kart
  ctx.fillStyle = CREAM;
  roundRect(ctx, 30, 30, W - 60, H - 60, 56);
  ctx.fill();
  ctx.strokeStyle = BURGUNDY;
  ctx.lineWidth = 10;
  roundRect(ctx, 75, 75, W - 150, H - 150, 36);
  ctx.stroke();
  ctx.lineWidth = 3;
  roundRect(ctx, 95, 95, W - 190, H - 190, 26);
  ctx.stroke();

  // Künc lenti + fiyonk
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(W - 380, 75);
  ctx.lineTo(W - 300, 75);
  ctx.lineTo(W - 75, 300);
  ctx.lineTo(W - 75, 380);
  ctx.closePath();
  ctx.fill();
  drawBow(ctx, W - 230, 225, 1.15);

  drawGiftLogo(ctx, W / 2, 110);

  // Əl yazısı başlıq
  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.font = `600 78px ${scriptFont}, 'Segoe Script', cursive`;
  ctx.fillText("Sənin üçün", W / 2 - 40, 470);
  ctx.fillText("xüsusi bir etiraf var...", W / 2 - 20, 560);
  drawOutlineHeart(ctx, W - 270, 470, 60);
  ctx.strokeStyle = RED;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W - 380, 600);
  ctx.quadraticCurveTo(W - 300, 560, W - 250, 510);
  ctx.stroke();

  // QR
  const qrSize = 496;
  const qrX = (W - qrSize) / 2;
  const qrY = 640;
  ctx.fillStyle = "#fff";
  roundRect(ctx, qrX - 30, qrY - 30, qrSize + 60, qrSize + 60, 28);
  ctx.fill();
  drawQr(ctx, url, qrX, qrY, qrSize);

  // Künc mötərizələri
  ctx.strokeStyle = BURGUNDY;
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  const pad = 62;
  const len = 70;
  const L = qrX - pad;
  const T = qrY - pad;
  const R = qrX + qrSize + pad;
  const B = qrY + qrSize + pad;
  for (const [x, y, dx, dy] of [[L, T, 1, 1], [R, T, -1, 1], [L, B, 1, -1], [R, B, -1, -1]] as const) {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * len);
    ctx.quadraticCurveTo(x, y, x + dx * len, y);
    ctx.stroke();
  }

  // Bəzəklər
  drawOutlineHeart(ctx, 190, 800, 56);
  drawArrow(ctx, 170, 1000, 260, 1080, -30);
  drawArrow(ctx, W - 160, 870, W - 260, 940, 30);

  // Alt düymə
  const pillW = 640;
  const pillH = 128;
  const pillX = (W - pillW) / 2;
  const pillY = 1222;
  ctx.fillStyle = BURGUNDY;
  roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  drawPhoneIcon(ctx, pillX + 70, pillY + 20);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = `600 44px ${SANS}`;
  ctx.fillText("QR kodu oxut", pillX + pillW / 2 + 40, pillY + 56);
  ctx.fillText("sürprizi aç ♡", pillX + pillW / 2 + 40, pillY + 108);

  // Alt xətt + ürək
  ctx.strokeStyle = BURGUNDY;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 260, 1385);
  ctx.quadraticCurveTo(W / 2 - 100, 1365, W / 2 - 25, 1380);
  ctx.moveTo(W / 2 + 25, 1380);
  ctx.quadraticCurveTo(W / 2 + 100, 1365, W / 2 + 260, 1385);
  ctx.stroke();
  drawOutlineHeart(ctx, W / 2, 1373, 36);

  return canvas;
}

export async function downloadEtirafQrCard(url: string, scriptFont: string, fileName: string) {
  const canvas = await renderEtirafQrCard(url, scriptFont);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("QR şəkli yaradıla bilmədi.");
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 2000);
}
