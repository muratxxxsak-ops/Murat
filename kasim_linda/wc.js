'use strict';
// ====== SULUBOYA MOTORU ======
// Sahne gerçek renklerle SRC'ye boyanır; kalem/mürekkep çizgileri LN'ye. WebGL son işlem:
// kenar titremesi, renk akması, pigment kenar birikmesi, granülasyon, kâğıt dokusu, kurşunkalem eskiz, düzensiz boya sınırı.
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const SRC = mkc(W, H); let C = SRC.getContext('2d');
const LN = mkc(W, H), L = LN.getContext('2d');
const BLR = mkc(W / 2, H / 2), BX = BLR.getContext('2d');
const TOP = mkc(W, H), TP = TOP.getContext('2d'); // son katman (beyaz guaj yağmur vb.)
const hexc = h => hx(h);
const cs = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const shade = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const tintc = (c, k) => [lerp(c[0], 255, k), lerp(c[1], 255, k), lerp(c[2], 255, k)];
// ---- boya yardımcıları ----
function Pth(pts, close = true) { C.beginPath(); C.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) C.lineTo(pts[i][0], pts[i][1]); if (close) C.closePath(); }
function smooth(ctx, pts, close = true) { const n = pts.length; ctx.beginPath();
  if (!close) { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n - 1; i++) { const p = pts[i], q = pts[i + 1]; ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } ctx.lineTo(pts[n - 1][0], pts[n - 1][1]); return; }
  ctx.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2); for (let i = 1; i <= n; i++) { const p = pts[i % n], q = pts[(i + 1) % n]; ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } ctx.closePath(); }
// yumuşak leke (ıslak boya)
function blob(x, y, r, col, a = 1, sy = 1) { if (r <= 0 || a <= 0) return; C.save(); C.translate(x, y); C.scale(1, sy); const g = C.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, cs(col, a)); g.addColorStop(.6, cs(col, a * .6)); g.addColorStop(1, cs(col, 0)); C.fillStyle = g; C.beginPath(); C.arc(0, 0, r, 0, TAU); C.fill(); C.restore(); }
function glaze(fn, col, a = 1) { C.save(); C.globalCompositeOperation = 'multiply'; C.globalAlpha = a; C.fillStyle = cs(col); fn(); C.fill(); C.restore(); }
function vwash(y0, y1, stops, x0 = -40, x1 = W + 40) { const g = C.createLinearGradient(0, y0, 0, y1); for (const [p, c] of stops) g.addColorStop(p, cs(c)); C.fillStyle = g; C.fillRect(x0, y0, x1 - x0, y1 - y0); }
function lgc(x0, y0, x1, y1, stops) { const g = C.createLinearGradient(x0, y0, x1, y1); for (const [p, c, a] of stops) g.addColorStop(clamp(p), cs(c, a === undefined ? 1 : a)); return g; }
function rgc(x, y, r0, r1, stops) { const g = C.createRadialGradient(x, y, r0, x, y, r1); for (const [p, c, a] of stops) g.addColorStop(clamp(p), cs(c, a === undefined ? 1 : a)); return g; }
// kalem/mürekkep çizgisi (LN)
function pen(pts, w = 1.2, a = .8, close = false, col = [40, 30, 28]) { L.save(); L.setTransform(C.getTransform()); smooth(L, pts, close); L.strokeStyle = cs(col, a); L.lineWidth = w; L.lineCap = 'round'; L.lineJoin = 'round'; L.stroke(); L.restore(); }
function penLine(x0, y0, x1, y1, w = 1.2, a = .8) { pen([[x0, y0], [x1, y1]], w, a); }
function penText(s, x, y, size, o = {}) { L.save(); L.setTransform(C.getTransform()); L.translate(x, y); L.rotate(o.rot || 0); L.font = `${o.weight || 600} ${size}px ${o.font || 'Caveat'}`; L.textAlign = o.align || 'center'; L.textBaseline = 'middle'; L.fillStyle = cs(o.col || [40, 30, 28], o.a === undefined ? .9 : o.a); L.fillText(s, 0, 0); L.restore(); }
// boya ile yazı (SRC)
function paintText(s, x, y, size, col, o = {}) { C.save(); C.translate(x, y); C.rotate(o.rot || 0); C.font = `${o.weight || 700} ${size}px ${o.font || 'Kalam'}`; C.textAlign = o.align || 'center'; C.textBaseline = 'middle'; C.letterSpacing = (o.sp || 0) + 'px'; C.globalAlpha = o.a === undefined ? 1 : o.a; C.fillStyle = cs(col); C.fillText(s, 0, 0); C.restore(); }

// ====== WebGL ======
const OUT = mkc(W, H);
const gl = OUT.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p * .5 + .5; gl_Position = vec4(p, 0, 1); }`;
const FS = `#version 300 es
precision highp float;
uniform sampler2D S, Bl, Ln; uniform float seed, tm, wet, pencil, reveal, margin;
in vec2 uv; out vec4 o;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ return vn(p) * .5 + vn(p * 2.03) * .3 + vn(p * 4.1) * .2; }
const vec2 R = vec2(${W}., ${H}.);
vec2 T(vec2 q){ return q; }
float lum(vec3 c){ return dot(c, vec3(.3, .59, .11)); }
void main(){
  vec2 q = vec2(uv.x, 1. - uv.y), p = q * R;
  vec2 w = (vec2(fbm(p * .012 + seed), fbm(p * .012 + 9.1 + seed)) - .5) * 7.;
  vec3 c = texture(S, T(q + w / R)).rgb;
  vec3 b = texture(Bl, T(q + w * 1.6 / R)).rgb;
  // renk akması: lekeli bölgelerde bulanığa doğru
  float bm = smoothstep(.42, .78, fbm(p * .006 + seed * 3.));
  c = mix(c, b, bm * .32 * wet);
  // pigment yoğunluğu (soğurma)
  vec3 d = clamp(1. - c, 0., 1.);
  // kenar birikmesi: bulanık katmanın eğimi
  vec2 e = 2. / R;
  float gx = lum(texture(Bl, T(q + vec2(e.x, 0) + w / R)).rgb) - lum(texture(Bl, T(q - vec2(e.x, 0) + w / R)).rgb);
  float gy = lum(texture(Bl, T(q + vec2(0, e.y) + w / R)).rgb) - lum(texture(Bl, T(q - vec2(0, e.y) + w / R)).rgb);
  float edge = smoothstep(.015, .09, length(vec2(gx, gy)));
  float dk = clamp(lum(b) - lum(c) + .02, 0., 1.);
  d *= 1. + edge * (.35 + dk * 2.2);
  // granülasyon + ıslak çiçeklenme
  float gr = vn(p * .8) * .5 + vn(p * .33) * .5;
  d *= .8 + .4 * gr;
  float bloom = fbm(p * .0045 + seed * 7.);
  d *= .78 + .44 * bloom;
  // kâğıt
  float fib = vn(p * vec2(.6, .05)) * vn(p * vec2(.05, .6));
  vec3 paper = vec3(.972, .958, .925) - fib * .04 - (vn(p * .02) - .5) * .02;
  vec3 col = paper * exp(-d * 1.35) / exp(-0.);
  col = mix(col, paper * (1. - d), .35);
  // kurşunkalem eskiz (keskin kaynak üzerinde Sobel)
  vec2 e1 = 1. / R; vec2 qq = q + w * .3 / R;
  float l00 = lum(texture(S, T(qq - e1)).rgb), l10 = lum(texture(S, T(qq + vec2(e1.x, -e1.y))).rgb), l01 = lum(texture(S, T(qq + vec2(-e1.x, e1.y))).rgb), l11 = lum(texture(S, T(qq + e1)).rgb);
  float sob = length(vec2((l10 + l11) - (l00 + l01), (l01 + l11) - (l00 + l10)));
  float pl = smoothstep(.12, .4, sob) * (.55 + .45 * vn(p * vec2(.3, .3) + 3.)) * pencil;
  col = mix(col, vec3(.33, .31, .3), pl * .55);
  // mürekkep katmanı
  vec4 ln = texture(Ln, T(q + w * .15 / R));
  col = mix(col, ln.rgb / max(ln.a, .001) * .9, ln.a * (.85 + .15 * vn(p * .5)));
  // düzensiz boya sınırı (kâğıt kenarı) ve açılış
  vec2 dd = min(p, R - p); float bd = min(dd.x, dd.y) - margin;
  float edgeN = (fbm(p * .03 + 11.) - .5) * 26.;
  float inside = smoothstep(0., 6., bd + edgeN);
  float rv = smoothstep(reveal - .08, reveal, 1. - fbm(p * .004 + seed * 2.) * .9 - length(q - .5) * .25);
  inside *= reveal >= 1. ? 1. : rv;
  col = mix(paper, col, inside);
  o = vec4(col, 1.);
}`;
function mkProg() {
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p;
}
const PROG = mkProg(); gl.useProgram(PROG);
const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
const aloc = gl.getAttribLocation(PROG, 'p'); gl.enableVertexAttribArray(aloc); gl.vertexAttribPointer(aloc, 2, gl.FLOAT, false, 0, 0);
function mkTex(unit) { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v); return t; }
const TX = [mkTex(0), mkTex(1), mkTex(2)];
gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
const U = n => gl.getUniformLocation(PROG, n);
gl.uniform1i(U('S'), 0); gl.uniform1i(U('Bl'), 1); gl.uniform1i(U('Ln'), 2);
function paint(o) {
  BX.setTransform(1, 0, 0, 1, 0, 0); BX.filter = 'blur(5px)'; BX.drawImage(SRC, 0, 0, W / 2, H / 2); BX.filter = 'none';
  gl.viewport(0, 0, W, H);
  const up = (i, src, pm) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, TX[i]); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, pm); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); };
  up(0, SRC, false); up(1, BLR, false); up(2, LN, true);
  gl.uniform1f(U('seed'), o.seed); gl.uniform1f(U('tm'), o.t); gl.uniform1f(U('wet'), o.wet === undefined ? 1 : o.wet); gl.uniform1f(U('pencil'), o.pencil === undefined ? 1 : o.pencil);
  gl.uniform1f(U('reveal'), o.reveal === undefined ? 1 : o.reveal); gl.uniform1f(U('margin'), o.margin === undefined ? 16 : o.margin);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  return OUT;
}
