'use strict';
// ====== YAĞLI BOYA MOTORU ======
// Sahne 540x960 tuvalde (1080x1920 koordinatlarıyla, 0.5 ölçek) boyanır; Kuwahara filtresi fırça darbesi verir; tuval dokusu tam çözünürlükte.
const W = 1080, H = 1920, TAU = Math.PI * 2;
const RW = 1080, RH = 1920;
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const SRC = mkc(RW, RH); let C = SRC.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
const seg = (t, a, b) => clamp((t - a) / (b - a));
function rng(seed) { let s = (seed * 2654435761) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const cs = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const shade = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const tint = (c, k) => [lerp(c[0], 255, k), lerp(c[1], 255, k), lerp(c[2], 255, k)];
const mix = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
// boya yardımcıları
function blob(x, y, r, col, a = 1, sy = 1) { if (r <= 0 || a <= 0) return; C.save(); C.translate(x, y); C.scale(1, sy); const g = C.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, cs(col, a)); g.addColorStop(.55, cs(col, a * .55)); g.addColorStop(1, cs(col, 0)); C.fillStyle = g; C.beginPath(); C.arc(0, 0, r, 0, TAU); C.fill(); C.restore(); }
function light(x, y, r, col, a = .5) { C.save(); C.globalCompositeOperation = 'lighter'; blob(x, y, r, col, a); C.restore(); }
function vg(y0, y1, stops, x0 = -50, x1 = W + 50) { const g = C.createLinearGradient(0, y0, 0, y1); for (const [p, c] of stops) g.addColorStop(p, cs(c)); C.fillStyle = g; C.fillRect(x0, y0, x1 - x0, y1 - y0); }
function lgr(x0, y0, x1, y1, stops) { const g = C.createLinearGradient(x0, y0, x1, y1); for (const [p, c, a] of stops) g.addColorStop(clamp(p), cs(c, a === undefined ? 1 : a)); return g; }
function rgr(x, y, r0, r1, stops) { const g = C.createRadialGradient(x, y, r0, x, y, r1); for (const [p, c, a] of stops) g.addColorStop(clamp(p), cs(c, a === undefined ? 1 : a)); return g; }
function path(pts, close = true) { const n = pts.length; C.beginPath(); if (!close) { C.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n - 1; i++) { const p = pts[i], q = pts[i + 1]; C.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } C.lineTo(pts[n - 1][0], pts[n - 1][1]); return; }
  C.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2); for (let i = 1; i <= n; i++) { const p = pts[i % n], q = pts[(i + 1) % n]; C.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } C.closePath(); }
function poly(pts) { C.beginPath(); C.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) C.lineTo(pts[i][0], pts[i][1]); C.closePath(); }
// ışık yönüne göre gölgelenmiş şekil + boya lekeleri
let LD = [-.6, -.7];
function form(pts, col, o = {}) { const P = () => (pts.length <= 5 && !o.round) ? poly(pts) : path(pts); P(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.max(x1 - x0, y1 - y0) * .55, L = o.L || LD;
  C.fillStyle = lgr(cx + L[0] * r, cy + L[1] * r, cx - L[0] * r, cy - L[1] * r, [[0, tint(col, o.hi === undefined ? .18 : o.hi)], [.45, col], [1, shade(col, o.lo || .5)]]); C.fill();
  if (o.tex !== false) { C.save(); P(); C.clip(); const R = rng(o.seed || ((cx * 7 + cy) | 0)); for (let i = 0; i < (o.n || 10); i++) blob(x0 + R() * (x1 - x0), y0 + R() * (y1 - y0), r * (.15 + R() * .25), R() < .5 ? tint(col, .12) : shade(col, .8), .35, .5 + R()); C.restore(); }
  if (o.rim) { C.save(); P(); C.clip(); C.globalCompositeOperation = 'lighter'; C.fillStyle = lgr(cx + L[0] * r * 1.05, cy + L[1] * r * 1.05, cx + L[0] * r * .7, cy + L[1] * r * .7, [[0, o.rim], [1, [0, 0, 0]]]); C.fillRect(x0 - 20, y0 - 20, x1 - x0 + 40, y1 - y0 + 40); C.restore(); }
}
function ell(x, y, rx, ry, n = 20, rot = 0) { return Array.from({ length: n }, (_, i) => { const a = i / n * TAU; const px = Math.cos(a) * rx, py = Math.sin(a) * ry; return [x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)]; }); }
function limb(a, b, c, w0, w1, w2, col, o = {}) { // tek parça inceltilmiş uzuv
  const n = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; }, n1 = n(a, b), n2 = n(b, c), nb = (() => { const x = n1[0] + n2[0], y = n1[1] + n2[1], l = Math.hypot(x, y) || 1; return [x / l, y / l]; })();
  const pts = [[a[0] + n1[0] * w0, a[1] + n1[1] * w0], [b[0] + nb[0] * w1, b[1] + nb[1] * w1], [c[0] + n2[0] * w2, c[1] + n2[1] * w2], [c[0] + (c[0] - b[0]) * .05, c[1] + (c[1] - b[1]) * .05], [c[0] - n2[0] * w2, c[1] - n2[1] * w2], [b[0] - nb[0] * w1, b[1] - nb[1] * w1], [a[0] - n1[0] * w0, a[1] - n1[1] * w0], [a[0] - (b[0] - a[0]) * .05, a[1] - (b[1] - a[1]) * .05]];
  form(pts, col, Object.assign({ n: 4 }, o)); }
// ====== WebGL: Kuwahara + renk + tuval ======
const MID = mkc(RW, RH); const OUT = mkc(W, H);
const g1 = MID.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
const g2 = OUT.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p * .5 + .5; gl_Position = vec4(p, 0, 1); }`;
const FS1 = `#version 300 es
precision highp float; uniform sampler2D S; uniform vec2 R; in vec2 uv; out vec4 o;
void main(){ vec2 q = vec2(uv.x, 1. - uv.y); const int K = 4; vec3 m[4]; vec3 s[4];
  for (int i = 0; i < 4; i++) { m[i] = vec3(0); s[i] = vec3(0); }
  for (int j = -K; j <= 0; j++) for (int i = -K; i <= 0; i++) { vec3 c = texture(S, q + vec2(i, j) / R).rgb; m[0] += c; s[0] += c * c; }
  for (int j = -K; j <= 0; j++) for (int i = 0; i <= K; i++) { vec3 c = texture(S, q + vec2(i, j) / R).rgb; m[1] += c; s[1] += c * c; }
  for (int j = 0; j <= K; j++) for (int i = 0; i <= K; i++) { vec3 c = texture(S, q + vec2(i, j) / R).rgb; m[2] += c; s[2] += c * c; }
  for (int j = 0; j <= K; j++) for (int i = -K; i <= 0; i++) { vec3 c = texture(S, q + vec2(i, j) / R).rgb; m[3] += c; s[3] += c * c; }
  float n = float((K + 1) * (K + 1)), best = 1e9; vec3 res = vec3(0);
  for (int k = 0; k < 4; k++) { vec3 mu = m[k] / n; vec3 v = abs(s[k] / n - mu * mu); float sv = v.r + v.g + v.b; if (sv < best) { best = sv; res = mu; } }
  o = vec4(res, 1.); }`;
const FS2 = `#version 300 es
precision highp float; uniform sampler2D S; uniform float seed, fade, sep, warm, cool, flash; in vec2 uv; out vec4 o;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
void main(){ vec2 q = vec2(uv.x, 1. - uv.y), p = q * vec2(1080., 1920.);
  // fırça yönlü hafif kayma
  vec2 w = (vec2(vn(p * .01 + seed), vn(p * .01 + 5.3 + seed)) - .5) * .004;
  vec3 c = texture(S, q + w).rgb;
  // hafif keskinleştirme (boya kenarı)
  vec3 b = (texture(S, q + vec2(.003, 0)).rgb + texture(S, q - vec2(.003, 0)).rgb + texture(S, q + vec2(0, .0017)).rgb + texture(S, q - vec2(0, .0017)).rgb) * .25;
  c += (c - b) * .6;
  // fırça izi: yön alanına göre çizgisel doku
  float ang = vn(p * .004 + seed) * 6.28; vec2 d = vec2(cos(ang), sin(ang));
  float st = vn(vec2(dot(p, d) * .05, dot(p, vec2(-d.y, d.x)) * .9));
  c *= .97 + .05 * st;
  // tuval örgüsü
  float weave = (sin(p.x * 1.35) * sin(p.y * 1.35)) * .5 + .5; c *= .95 + .07 * weave; c += (h21(p * .7) - .5) * .03;
  // renk: sepya geçmiş, sıcak/soğuk
  float l = dot(c, vec3(.3, .59, .11)); c = mix(c, vec3(l) * vec3(1.15, .95, .7), sep);
  c *= mix(vec3(1), vec3(1.08, .98, .86), warm); c *= mix(vec3(1), vec3(.86, .95, 1.1), cool);
  vec2 v = q - .5; c *= 1. - dot(v * vec2(1., .7), v * vec2(1., .7)) * .9;
  c = mix(c, vec3(1., .97, .92), flash); c *= 1. - fade;
  o = vec4(c, 1.); }`;
function mk(gl, fs) { const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); gl.useProgram(p);
  const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW); const l = gl.getAttribLocation(p, 'p'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  gl.uniform1i(gl.getUniformLocation(p, 'S'), 0); return { p, u: n => gl.getUniformLocation(p, n) }; }
const P1 = mk(g1, FS1), P2 = mk(g2, FS2);
g1.uniform2f(P1.u('R'), RW, RH);
function paint(o) {
  g1.viewport(0, 0, RW, RH); g1.texImage2D(g1.TEXTURE_2D, 0, g1.RGBA, g1.RGBA, g1.UNSIGNED_BYTE, SRC); g1.drawArrays(g1.TRIANGLE_STRIP, 0, 4);
  g2.viewport(0, 0, W, H); g2.texImage2D(g2.TEXTURE_2D, 0, g2.RGBA, g2.RGBA, g2.UNSIGNED_BYTE, MID);
  g2.uniform1f(P2.u('seed'), o.seed || 0); g2.uniform1f(P2.u('fade'), o.fade || 0); g2.uniform1f(P2.u('sep'), o.sep || 0); g2.uniform1f(P2.u('warm'), o.warm || 0); g2.uniform1f(P2.u('cool'), o.cool || 0); g2.uniform1f(P2.u('flash'), o.flash || 0);
  g2.drawArrays(g2.TRIANGLE_STRIP, 0, 4); return OUT; }
