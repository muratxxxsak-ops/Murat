'use strict';
// ====== HAMUR (CLAYMATION) MOTORU ======
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const SRC = mkc(W, H); let C = SRC.getContext('2d');
const cs = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const shade = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const tintc = (c, k) => [lerp(c[0], 255, k), lerp(c[1], 255, k), lerp(c[2], 255, k)];
// stop-motion titreşimi: her 2 karede bir değişen küçük kayma
let JSEED = 0, JN = 0, JAMP = .9;
function jit() { JN++; const r = Math.sin(JN * 12.9898 + JSEED * 78.233) * 43758.5453; return (r - Math.floor(r) - .5) * 2 * JAMP; }
let LIT = [-.45, -.7]; // ışık yönü (ışığa doğru)
// ---- temel hamur şekilleri ----
function ball(x, y, rx, ry, col, rot = 0, o = {}) {
  x += jit(); y += jit(); C.save(); C.translate(x, y); C.rotate(rot);
  const g = C.createRadialGradient(LIT[0] * rx * .45, LIT[1] * ry * .45, Math.min(rx, ry) * .05, 0, 0, Math.max(rx, ry) * 1.05);
  g.addColorStop(0, cs(tintc(col, .28))); g.addColorStop(.5, cs(col)); g.addColorStop(1, cs(shade(col, o.dark || .62)));
  C.beginPath(); C.ellipse(0, 0, rx, ry, 0, 0, TAU); C.fillStyle = g; C.fill();
  if (o.spec !== 0) { const s = C.createRadialGradient(LIT[0] * rx * .5, LIT[1] * ry * .55, 0, LIT[0] * rx * .5, LIT[1] * ry * .55, Math.min(rx, ry) * .35); s.addColorStop(0, `rgba(255,255,255,${o.spec || .3})`); s.addColorStop(1, 'rgba(255,255,255,0)'); C.fillStyle = s; C.fill(); }
  C.restore();
}
function sausage(a, b, w, col, w2) {
  w2 = w2 === undefined ? w : w2; const ax = a[0] + jit(), ay = a[1] + jit(), bx = b[0] + jit(), by = b[1] + jit();
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, an = Math.atan2(ny, nx);
  C.beginPath(); C.moveTo(ax + nx * w, ay + ny * w); C.lineTo(bx + nx * w2, by + ny * w2); C.arc(bx, by, w2, an, an + Math.PI, true); C.lineTo(ax - nx * w, ay - ny * w); C.arc(ax, ay, w, an + Math.PI, an + TAU, true); C.closePath();
  const s = (LIT[0] * nx + LIT[1] * ny) > 0 ? 1 : -1, mx = (ax + bx) / 2, my = (ay + by) / 2, ww = Math.max(w, w2);
  const g = C.createLinearGradient(mx + nx * ww * s, my + ny * ww * s, mx - nx * ww * s, my - ny * ww * s);
  g.addColorStop(0, cs(tintc(col, .22))); g.addColorStop(.35, cs(col)); g.addColorStop(1, cs(shade(col, .6))); C.fillStyle = g; C.fill();
}
function smoothP(pts, close = true) { const n = pts.length; C.beginPath(); C.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
  for (let i = 1; i <= n; i++) { const p = pts[i % n], q = pts[(i + 1) % n]; C.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } C.closePath(); }
function blobShape(pts, col, o = {}) { const j = pts.map(p => [p[0] + jit(), p[1] + jit()]); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of j) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.max(x1 - x0, y1 - y0) / 2;
  smoothP(j); const g = C.createRadialGradient(cx + LIT[0] * r * .45, cy + LIT[1] * r * .45, r * .05, cx, cy, r * 1.1); g.addColorStop(0, cs(tintc(col, .22))); g.addColorStop(.5, cs(col)); g.addColorStop(1, cs(shade(col, o.dark || .62))); C.fillStyle = g; C.fill(); }
function slab(x, y, w, h, col, r = 8, o = {}) { // yuvarlak köşeli karton/hamur blok
  x += jit() * .5; y += jit() * .5; C.beginPath(); C.roundRect(x, y, w, h, r);
  const g = C.createLinearGradient(x, y, x + w * .3, y + h); g.addColorStop(0, cs(tintc(col, o.hi === undefined ? .12 : o.hi))); g.addColorStop(1, cs(shade(col, o.lo || .8))); C.fillStyle = g; C.fill();
  if (o.edge !== false) { C.strokeStyle = cs(shade(col, .65), .5); C.lineWidth = 1.5; C.stroke(); } }
function softShadow(x, y, rx, ry, a = .35) { C.save(); C.translate(x, y); C.scale(1, ry / rx); const g = C.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, `rgba(30,20,20,${a})`); g.addColorStop(1, 'rgba(30,20,20,0)'); C.fillStyle = g; C.beginPath(); C.arc(0, 0, rx, 0, TAU); C.fill(); C.restore(); }
function glowC(x, y, r, col, a = .5) { C.save(); C.globalCompositeOperation = 'lighter'; const g = C.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, cs(col, a)); g.addColorStop(1, cs(col, 0)); C.fillStyle = g; C.beginPath(); C.arc(x, y, r, 0, TAU); C.fill(); C.restore(); }
function vgrad(y0, y1, stops, x0 = -40, x1 = W + 40) { const g = C.createLinearGradient(0, y0, 0, y1); for (const [p, c] of stops) g.addColorStop(p, cs(c)); C.fillStyle = g; C.fillRect(x0, y0, x1 - x0, y1 - y0); }
// karakter katmanı: ayrı tuvalde çizip gölgeyle yapıştır
const LAY = mkc(W, H), LX = LAY.getContext('2d');
function layer(fn, o = {}) { const prev = C; LX.setTransform(1, 0, 0, 1, 0, 0); LX.clearRect(0, 0, W, H); C = LX; C.setTransform(prev.getTransform()); let r; try { r = fn(); } finally { C = prev; }
  C.save(); C.setTransform(1, 0, 0, 1, 0, 0); if (o.shadow !== false) { C.shadowColor = `rgba(25,15,20,${o.sa || .35})`; C.shadowBlur = o.sb || 22; C.shadowOffsetX = o.sx === undefined ? 14 : o.sx; C.shadowOffsetY = o.sy === undefined ? 10 : o.sy; }
  if (o.blur) C.filter = `blur(${o.blur}px)`; C.globalAlpha = o.alpha === undefined ? 1 : o.alpha; C.drawImage(LAY, 0, 0); C.restore(); return r; }
// komik ses yazısı (SFX)
function sfx(s, x, y, size, col = [255, 220, 60], rot = -.1, k = 1) { if (k <= 0) return; C.save(); C.translate(x, y); C.rotate(rot); const sc = .6 + .4 * eo(k) + .08 * Math.sin(k * 20) * (1 - k); C.scale(sc, sc);
  C.font = `700 ${size}px Kalam`; C.textAlign = 'center'; C.textBaseline = 'middle'; C.lineJoin = 'round'; C.lineWidth = size * .16; C.strokeStyle = '#2a1a1a'; C.strokeText(s, 0, 0); C.fillStyle = cs(col); C.fillText(s, 0, 0); C.restore(); }
function label(s, x, y, size, col = [60, 40, 36], o = {}) { C.save(); C.translate(x, y); C.rotate(o.rot || 0); C.font = `${o.w || 700} ${size}px ${o.font || 'Kalam'}`; C.textAlign = o.align || 'center'; C.textBaseline = 'middle'; C.globalAlpha = o.a === undefined ? 1 : o.a; C.fillStyle = cs(col); C.fillText(s, 0, 0); C.restore(); }

// ====== WebGL son işlem: hamur dokusu (parmak izi), film grenı, hafif sıcak renk, vinyet ======
const OUT = mkc(W, H);
const gl = OUT.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p * .5 + .5; gl_Position = vec4(p, 0, 1); }`;
const FS = `#version 300 es
precision highp float;
uniform sampler2D S; uniform float seed, flash;
in vec2 uv; out vec4 o;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
const vec2 R = vec2(${W}., ${H}.);
void main(){
  vec2 q = vec2(uv.x, 1. - uv.y), p = q * R;
  vec3 c = texture(S, q).rgb;
  // hamur yüzeyi: küçük tümsekler ve parmak izi halkaları -> ışıkla gölgelenmiş kabartma
  float b0 = vn(p * .09) * .6 + vn(p * .25) * .4;
  float ring = sin((length(p - floor(p / 90.) * 90. - 45.) + vn(p * .02) * 30.) * .55) * .5 + .5;
  float hgt = b0 * .7 + ring * .3 * vn(p * .01 + 4.);
  float dx = (vn((p + vec2(1, 0)) * .09) - vn((p - vec2(1, 0)) * .09)), dy = (vn((p + vec2(0, 1)) * .09) - vn((p - vec2(0, 1)) * .09));
  c *= 1. + (-dx * .6 - dy * .9) * .3 + (hgt - .5) * .04;
  // grenli film + sıcak renk
  c += (h21(p + seed * 13.1) - .5) * .035;
  c = mix(c, c * vec3(1.04, 1., .93), .6);
  vec2 v = q - .5; c *= 1. - dot(v, v) * .55;
  c = mix(c, vec3(1., .98, .92), flash);
  o = vec4(c, 1.);
}`;
const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
const PROG = gl.createProgram(); gl.attachShader(PROG, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(PROG, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(PROG); gl.useProgram(PROG);
const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
const aloc = gl.getAttribLocation(PROG, 'p'); gl.enableVertexAttribArray(aloc); gl.vertexAttribPointer(aloc, 2, gl.FLOAT, false, 0, 0);
const TX = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, TX); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.uniform1i(gl.getUniformLocation(PROG, 'S'), 0);
function post(o) { gl.viewport(0, 0, W, H); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, TX); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SRC);
  gl.uniform1f(gl.getUniformLocation(PROG, 'seed'), o.seed); gl.uniform1f(gl.getUniformLocation(PROG, 'flash'), o.flash || 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); return OUT; }
// pürüzsüz eklemli uzuv: aynı yolu üç kez çizerek (gölge, ana renk, parlak) hacim verir
function limbS(pts, w, col) {
  const J = pts.map(p => [p[0] + jit(), p[1] + jit()]);
  const path = (dx, dy) => { C.beginPath(); C.moveTo(J[0][0] + dx, J[0][1] + dy); if (J.length === 3) C.quadraticCurveTo(J[1][0] + dx, J[1][1] + dy, J[2][0] + dx, J[2][1] + dy); else for (let i = 1; i < J.length; i++) C.lineTo(J[i][0] + dx, J[i][1] + dy); };
  C.save(); C.lineCap = 'round'; C.lineJoin = 'round';
  path(0, 0); C.strokeStyle = cs(shade(col, .62)); C.lineWidth = 2 * w; C.stroke();
  path(LIT[0] * w * .22, LIT[1] * w * .22); C.strokeStyle = cs(col); C.lineWidth = 1.5 * w; C.stroke();
  path(LIT[0] * w * .45, LIT[1] * w * .45); C.strokeStyle = cs(tintc(col, .2)); C.lineWidth = .7 * w; C.stroke();
  path(LIT[0] * w * .55, LIT[1] * w * .55); C.strokeStyle = cs(tintc(col, .4), .5); C.lineWidth = .25 * w; C.stroke();
  C.restore();
}
