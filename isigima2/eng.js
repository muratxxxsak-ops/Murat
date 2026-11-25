'use strict';
// ====== GRAVÜR MOTORU ======
// Sahne, kaynak tuvale "kodlu" çizilir: R = ton (0 mürekkep, 1 kâğıt), G = tarama açısı (0..π), B = altın varak maskesi.
// Ayrı bir parıltı tuvali (GL) altın ışığın yayılmasını tutar. WebGL son işlem bunları gravüre çevirir.
const mkc = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const SRC = mkc(W, H); let C = SRC.getContext('2d');
const GLW = mkc(W / 2, H / 2), G = GLW.getContext('2d');
const ANG = a => { a = a % Math.PI; if (a < 0) a += Math.PI; return a / Math.PI; };
// figür çizerken yansıtma durumu: açıları ekrana çevirir
let FLIP = 1, ROT = 0;
const tA = a => FLIP > 0 ? a + ROT : Math.PI - a + ROT;
function ink(v, a, gold = 0) { return `rgb(${(clamp(v) * 255) | 0},${(ANG(tA(a)) * 255) | 0},${(clamp(gold) * 255) | 0})`; }
function lg(x0, y0, x1, y1, stops, a, gold = 0) { const g = C.createLinearGradient(x0, y0, x1, y1); for (const [p, v] of stops) g.addColorStop(clamp(p), ink(v, a, gold)); return g; }
function rg(x, y, r0, r1, stops, a, gold = 0) { const g = C.createRadialGradient(x, y, r0, x, y, r1); for (const [p, v] of stops) g.addColorStop(clamp(p), ink(v, a, gold)); return g; }
// tona ışık ekle (yalnız R kanalı)
function lightR(x, y, r, amt, sy = 1) {
  if (amt <= 0 || r <= 0) return; C.save(); C.globalCompositeOperation = 'lighter'; C.translate(x, y); C.scale(1, sy);
  const g = C.createRadialGradient(0, 0, 0, 0, 0, r); const k = clamp(amt) * 255;
  g.addColorStop(0, `rgb(${k | 0},0,0)`); g.addColorStop(.4, `rgb(${(k * .45) | 0},0,0)`); g.addColorStop(1, 'rgb(0,0,0)');
  C.fillStyle = g; C.beginPath(); C.arc(0, 0, r, 0, TAU); C.fill(); C.restore();
}
function darkR(x, y, r, amt, sy = 1) { // tonu karart (yalnız R): çarpma
  if (amt <= 0) return; C.save(); C.globalCompositeOperation = 'multiply'; C.translate(x, y); C.scale(1, sy);
  const g = C.createRadialGradient(0, 0, 0, 0, 0, r), k = 255 * (1 - clamp(amt));
  g.addColorStop(0, `rgb(${k | 0},255,255)`); g.addColorStop(1, 'rgb(255,255,255)'); C.fillStyle = g; C.beginPath(); C.arc(0, 0, r, 0, TAU); C.fill(); C.restore();
}
function toneMul(k) { C.save(); C.globalCompositeOperation = 'multiply'; C.setTransform(1, 0, 0, 1, 0, 0); C.fillStyle = `rgb(${(255 * clamp(k)) | 0},255,255)`; C.fillRect(0, 0, W, H); C.restore(); }
// altın parıltı (GL tuvali yarı çözünürlükte)
function glow(x, y, r, a = 1) {
  if (a <= 0 || r <= 0) return; G.save(); G.globalCompositeOperation = 'lighter'; const m = C.getTransform(); G.setTransform(m.a / 2, m.b / 2, m.c / 2, m.d / 2, m.e / 2, m.f / 2);
  const g = G.createRadialGradient(x, y, 0, x, y, r), k = (clamp(a) * 255) | 0;
  g.addColorStop(0, `rgb(${k},${k},${k})`); g.addColorStop(.25, `rgb(${(k * .5) | 0},${(k * .5) | 0},${(k * .5) | 0})`); g.addColorStop(1, 'rgb(0,0,0)');
  G.fillStyle = g; G.beginPath(); G.arc(x, y, r, 0, TAU); G.fill(); G.restore();
}
// yol çizim kısayolları
function P(pts, close = true) { C.beginPath(); C.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) C.lineTo(pts[i][0], pts[i][1]); if (close) C.closePath(); }
function fillP(pts, style) { P(pts); C.fillStyle = style; C.fill(); }
function strokeTone(pts, v, a, w, close = false) { P(pts, close); C.strokeStyle = ink(v, a); C.lineWidth = w; C.lineCap = 'round'; C.lineJoin = 'round'; C.stroke(); }
// çizgi: mürekkep konturu (doğrudan ton 0)
function inkLine(x0, y0, x1, y1, w = 1.5, v = 0) { C.beginPath(); C.moveTo(x0, y0); C.lineTo(x1, y1); C.strokeStyle = ink(v, 0); C.lineWidth = w; C.lineCap = 'round'; C.stroke(); }

// ====== WebGL son işlem ======
const OUT = mkc(W, H);
const gl = OUT.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p * .5 + .5; gl_Position = vec4(p, 0, 1); }`;
const FS = `#version 300 es
precision highp float;
uniform sampler2D T, Lg; uniform vec2 off; uniform float seed, tm, sp, flash, inkFade, paperFade, warm;
in vec2 uv; out vec4 o;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float hatch(vec2 p, float ang, float w, float s){
  if (w <= 0.) return 0.;
  vec2 d = vec2(cos(ang), sin(ang)), n = vec2(-d.y, d.x);
  float al = dot(p, d), u = dot(p, n) / s;
  u += (vn(vec2(al * .013, floor(u) * 1.7 + seed * 5.1)) - .5) * .5;
  float ln = floor(u);
  float th = vn(vec2(al * .03 + seed, ln * 3.1));       // çizgi boyunca kalınlık dalgası (burin baskısı)
  float f = abs(fract(u) - .5) * 2.;
  float ww = clamp(w * (.75 + .5 * th), 0., 1.);
  float aa = 1.6 / s;
  return 1. - smoothstep(ww - aa, ww + aa, f);
}
void main(){
  vec2 px = vec2(uv.x, 1. - uv.y) * vec2(${W}., ${H}.);
  vec4 s = texture(T, vec2(uv.x, 1. - uv.y));
  float v = s.r, ang = s.g * 3.14159265, g = s.b;
  vec2 hp = px + off;
  float d = 1. - v;
  // ton -> tarama katmanları
  float L1 = hatch(hp, ang, clamp((d - .04) * 1.25, 0., .62), sp);
  float L2 = hatch(hp, ang + 1.05, clamp((d - .42) * 1.35, 0., .55), sp * 1.08);
  float L3 = hatch(hp, ang - 1.02, clamp((d - .66) * 1.6, 0., .6), sp * .95);
  float st = smoothstep(.86, .97, d);
  // noktalama (ara tonlarda ince doku)
  float dots = step(h21(floor(hp / 2.) + seed), d * .22) * step(.15, d) * (1. - step(.6, d));
  float ink = max(max(L1, L2), max(L3, st));
  // kontur: ton ve altın sıçramaları
  vec2 e = vec2(1. / ${W}., 1. / ${H}.);
  float tl = texture(T, vec2(uv.x, 1. - uv.y) + vec2(-e.x, -e.y)).r, tr = texture(T, vec2(uv.x, 1. - uv.y) + vec2(e.x, -e.y)).r;
  float bl = texture(T, vec2(uv.x, 1. - uv.y) + vec2(-e.x, e.y)).r, br = texture(T, vec2(uv.x, 1. - uv.y) + vec2(e.x, e.y)).r;
  float gx = (tr + br) - (tl + bl), gy = (bl + br) - (tl + tr);
  float edge = smoothstep(.16, .42, length(vec2(gx, gy)));
  ink = max(ink, edge * .9);
  ink = mix(ink, 0., inkFade);
  // kâğıt
  float mott = vn(px * .006) * .6 + vn(px * .02) * .4, fib = vn(px * vec2(.9, .08) + 7.) * vn(px * vec2(.07, .7));
  vec3 paper = vec3(.925, .885, .80) * (.95 + .06 * mott) - fib * .035;
  vec2 q = uv - .5; paper *= 1. - dot(q, q) * .35;
  vec3 inkc = vec3(.10, .085, .08) + .03 * vn(px * .05);
  vec3 col = mix(paper, inkc, ink * .96);
  // altın varak
  if (g > .01) {
    float fl = vn(px * .09) * .6 + vn(px * .35) * .4;
    float crack = smoothstep(.47, .5, vn(px * .045)) * (1. - smoothstep(.5, .53, vn(px * .045)));
    vec3 gb = mix(vec3(.38, .22, .06), vec3(1., .84, .47), pow(v, .85));
    gb *= .82 + .36 * fl;
    gb += vec3(1., .92, .7) * .18 * pow(max(0., sin(px.x * .012 + px.y * .007 - tm * 1.3)), 8.);
    gb = mix(gb, gb * .55, crack * .5);
    vec3 gcol = mix(gb, vec3(.22, .12, .04), ink * .55 * smoothstep(.15, .7, d));
    col = mix(col, gcol, g);
  }
  // altın ışık (parıltı)
  float lg = texture(Lg, vec2(uv.x, 1. - uv.y)).r;
  vec3 wc = mix(vec3(1., .74, .34), vec3(1., .55, .2), warm);
  col = 1. - (1. - col) * (1. - wc * lg * .85);
  col = mix(col, vec3(1., .97, .9), flash);
  col = mix(col, paper, paperFade);
  o = vec4(col, 1.);
}`;
function mkProg() {
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p;
}
const PROG = mkProg(); gl.useProgram(PROG);
const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
const loc = gl.getAttribLocation(PROG, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
function mkTex(unit) { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; }
const TX0 = mkTex(0), TX1 = mkTex(1);
gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
const U = n => gl.getUniformLocation(PROG, n);
gl.uniform1i(U('T'), 0); gl.uniform1i(U('Lg'), 1);
function engrave(o) {
  gl.viewport(0, 0, W, H);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, TX0); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SRC);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, TX1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, GLW);
  gl.uniform2f(U('off'), o.off[0], o.off[1]); gl.uniform1f(U('seed'), o.seed); gl.uniform1f(U('tm'), o.t); gl.uniform1f(U('sp'), o.sp || 5.2);
  gl.uniform1f(U('flash'), o.flash || 0); gl.uniform1f(U('inkFade'), o.inkFade || 0); gl.uniform1f(U('paperFade'), o.paperFade || 0); gl.uniform1f(U('warm'), o.warm || 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  return OUT;
}
// yalnız tonu çarpan degrade (G,B = 255 kalır)
function mg(x0, y0, x1, y1, stops) { const g = C.createLinearGradient(x0, y0, x1, y1); for (const [p, v] of stops) g.addColorStop(clamp(p), `rgb(${(clamp(v) * 255) | 0},255,255)`); return g; }
