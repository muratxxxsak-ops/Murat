'use strict';
// ===== WebGL2 ışın yürütme (raymarching) motoru =====
const GW = 960, GH = 540;
const GLC = document.createElement('canvas'); GLC.width = GW; GLC.height = GH;
const gl = GLC.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
const FS = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 R; uniform float T;
uniform vec3 cP, cT; uniform float cF, cRoll;
uniform vec4 L[4]; uniform vec3 LC[4]; uniform int NL;
uniform vec3 J[64]; uniform vec4 CH[4]; uniform vec4 CH2[4];
uniform vec4 BX[24]; uniform vec4 BS[24];
uniform vec4 SC; uniform vec4 SC2; uniform vec4 SC3; uniform vec4 SC4;
uniform vec3 SKY0, SKY1, FOGC, AMB;
#define PI 3.14159265
float h11(float n){return fract(sin(n*127.1)*43758.5453);}
float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float n=dot(i,vec3(1,57,113));
 return mix(mix(mix(h11(n),h11(n+1.),f.x),mix(h11(n+57.),h11(n+58.),f.x),f.y),mix(mix(h11(n+113.),h11(n+114.),f.x),mix(h11(n+170.),h11(n+171.),f.x),f.y),f.z);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float sdCap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
float sdCap2(vec3 p,vec3 a,vec3 b,float ra,float rb){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-mix(ra,rb,h);}
float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float sdEll(vec3 p,vec3 r){float k0=length(p/r);float k1=length(p/(r*r));return k0*(k0-1.)/k1;}
float sdCyl(vec3 p,float r,float h){vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);return min(max(d.x,d.y),0.)+length(max(d,0.));}
vec2 U(vec2 a,vec2 b){return a.x<b.x?a:b;}
mat2 r2(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
// ---- insan (tip derleme zamanında sabit) ----
vec2 human(vec3 p,int i,int ty){
 int o=i*16; vec4 c=CH[i]; vec4 c2=CH2[i];
 vec3 pel=J[o],ch=J[o+1];
 bool fem=ty==2; float sk=fem?.82:1.;
 float mat=fem?6.:(ty==3?12.:3.);
 vec3 a=J[o+10],b=J[o+11],e=J[o+12],f=J[o+13],g=J[o+14],h=J[o+15];
 float d=min(min(sdCap2(p,a,b,.085*sk,.065*sk),sdCap2(p,b,e,.062*sk,.045*sk)),min(sdCap2(p,f,g,.085*sk,.065*sk),sdCap2(p,g,h,.062*sk,.045*sk)));
 vec3 fw=vec3(sin(c.y),0,cos(c.y));
 float sh=min(sdCap(p,e-vec3(0,.04,0)-fw*.03,e-vec3(0,.05,0)+fw*.13,.045*sk),sdCap(p,h-vec3(0,.04,0)-fw*.03,h-vec3(0,.05,0)+fw*.13,.045*sk));
 vec2 res=U(vec2(sh,13.),vec2(d,fem?4.:mat));
 float top=ch.y-.05, bot=(b.y+g.y)*.5-(fem?.12:.05);
 float tor=sdCap2(p,pel+vec3(0,.05,0),ch,fem?.13:.16,fem?.15:.19);
 vec3 s1=J[o+4],e1=J[o+5],h1=J[o+6],s2=J[o+7],e2=J[o+8],h2=J[o+9];
 tor=smin(tor,sdCap(p,s1,s2,fem?.06:.075),.08);
 vec3 wind=vec3(c2.x,0.,c2.y);
 float hh=clamp((top-p.y)/(top-bot),0.,1.);
 vec3 ax=mix(ch,vec3((b.x+g.x)*.5,bot,(b.z+g.z)*.5),hh)+wind*hh*hh*(.15+.05*sin(T*9.+p.y*6.));
 float coat=max(length((p-ax).xz)-mix(fem?.14:.19,fem?.3:.25,hh), max(p.y-top,bot-p.y));
 float body=smin(tor,coat,.06);
 float arm=min(min(sdCap2(p,s1,e1,.07*sk,.06*sk),sdCap2(p,e1,h1,.06*sk,.045*sk)),min(sdCap2(p,s2,e2,.07*sk,.06*sk),sdCap2(p,e2,h2,.06*sk,.045*sk)));
 body=smin(body,arm,.04);
 res=U(res,vec2(body,mat));
 res=U(res,vec2(min(sdEll(p-h1,vec3(.045,.07,.05)*sk),sdEll(p-h2,vec3(.045,.07,.05)*sk)),4.));
 vec3 hd=J[o+3],nk=J[o+2];
 vec3 q=p-hd; q.xz=r2(-(c.y+c.z))*q.xz;
 float neck=sdCap(p,nk-vec3(0,.04,0),hd-vec3(0,.06,0),.05*sk);
 float head=sdEll(q,vec3(.085,.115,.1)*sk);
 head=smin(head,sdEll(q-vec3(0,-.07,.035)*sk,vec3(.06,.05,.065)*sk),.04);
 head=smin(head,sdCap(q,vec3(0,.0,.09)*sk,vec3(0,-.035,.115)*sk,.014*sk),.015);
 vec3 qa=vec3(abs(q.x),q.yz);
 head=smin(head,sdEll(qa-vec3(.088,0,0)*sk,vec3(.015,.032,.022)),.01);
 res=U(res,vec2(smin(head,neck,.03),4.));
 if(ty==1){
  vec3 hq=q-vec3(0,.075,-.005); float brim=sdCyl(hq,.2,.004)-.004+.06*hq.x*hq.x-.03*hq.z*hq.z;
  vec3 cq=hq-vec3(0,.065,0); cq.xz*=1.+max(cq.y,0.)*2.2; float crown=sdCyl(cq,.094,.055)-.018; crown=max(crown,-sdEll(hq-vec3(0,.145,0),vec3(.022,.03,.1))); crown=max(crown,-sdEll(vec3(abs(hq.x),hq.yz)-vec3(.06,.12,.085),vec3(.03,.04,.03)));
  res=U(res,vec2(min(brim,crown),5.));
  float band=max(sdCyl(hq-vec3(0,.02,0),.113,.012),-sdCyl(hq,.1,.1)); res=U(res,vec2(band,14.));
 } else if(ty==2){
  float hair=sdEll(q-vec3(0,.025,-.02),vec3(.1,.125,.115));
  hair=smin(hair,sdCap2(q,vec3(0,.0,-.05),vec3(0,-.26,-.08)+vec3(c2.x,0,c2.y)*.1,.1,.07),.06);
  hair=max(hair,-sdBox(q-vec3(0,-.05,.12),vec3(.08,.12,.07)));
  res=U(res,vec2(hair,7.));
 } else { float hair=max(sdEll(q-vec3(0,.02,-.01),vec3(.09,.12,.105)),-q.y); hair=max(hair,-sdBox(q-vec3(0,0,.1),vec3(.1,.08,.04))); res=U(res,vec2(hair,7.)); }
 return res;
}
// ---- dünya ----
vec2 bldRow(vec3 p,float side,float w){ // sokak duvarları (z boyunca tekrar)
 float cell=6.; float id=floor(p.z/cell); vec3 q=p; q.z=mod(p.z,cell)-cell*.5;
 float hgt=SC2.x*(.6+.8*h11(id*3.1+side*7.)); float dep=.3*h11(id+side);
 q.x=side*(p.x)-(w*.5+4.+dep);
 float d=sdBox(q-vec3(0,hgt*.5,0),vec3(4.,hgt*.5,cell*.5-.02));
 // pencere oyukları
 vec3 wq=vec3(q.y,q.z,0.); vec2 g=vec2(mod(q.y,3.)-1.5,mod(q.z+.0,2.)-1.); float win=sdBox(vec3(q.x+4.,g.x-.2,g.y),vec3(.12,.75,.45));
 d=max(d,-win);
 return vec2(d,2.);
}
vec2 skyline(vec3 p){
 float cell=9.; vec2 id=floor(p.xz/cell); vec3 q=p; q.xz=mod(p.xz,cell)-cell*.5;
 float hh=h21(id)*h21(id+3.1); float hgt=8.+60.*hh*hh+SC4.w;
 if(length(id*cell+cell*.5-SC4.yz)<SC4.x) return vec2(9.,0.);
 float d=sdBox(q-vec3(0,hgt*.5+SC2.y,0),vec3(3.4+h21(id+7.)*.8,hgt*.5,3.4+h21(id+9.)*.8));
 return vec2(min(d,cell*.6),2.5);
}
vec2 map(vec3 p){
 vec2 r=vec2(1e9,0.);
#ifdef GROUND
 r=U(r,vec2(p.y,1.));
#endif
#ifdef ALLEY
 r=U(r,bldRow(p,1.,SC.y)); r=U(r,bldRow(p,-1.,SC.y)); r=U(r,vec2(sdBox(vec3(abs(p.x)-SC.y*.5+.15,p.y-.08,p.z),vec3(.3,.08,1e3)),15.));
#endif
#ifdef SKYL
 r=U(r,skyline(p));
#endif
#ifdef ROOF
 r=U(r,vec2(sdBox(p-vec3(0,.5,SC.w),vec3(30.,.5,.35)),10.)); r=U(r,vec2(sdBox(p-vec3(0,-20.,SC.w-20.),vec3(60.,20.,20.)),10.));
#endif
#if NBOX>0
 for(int i=0;i<NBOX;i++){ vec4 b=BX[i],s=BS[i]; vec3 q=p-b.xyz; q.xz=r2(b.w)*q.xz; float d=sdBox(q,s.xyz-.01)-.01; r=U(r,vec2(d,s.w)); }
#endif
#if NCH>0
 r=U(r,human(p,0,CHT0));
#endif
#if NCH>1
 r=U(r,human(p,1,CHT1));
#endif
#if NCH>2
 r=U(r,human(p,2,CHT2));
#endif
#if NCH>3
 r=U(r,human(p,3,CHT3));
#endif
 return r;
}
vec2 march(vec3 ro,vec3 rd){float t=.02;vec2 h;for(int i=0;i<130;i++){h=map(ro+rd*t);if(abs(h.x)<.0008*t||t>200.)break;t+=h.x*.85;}return vec2(t,h.y);}
vec3 nrm(vec3 p,float t){float e=.0012*max(1.,t*.3);vec3 n=vec3(0);for(int i=0;i<4;i++){vec3 k=.5773*(2.*vec3(float(((i+3)>>1)&1),float((i>>1)&1),float(i&1))-1.);n+=k*map(p+e*k).x;}return normalize(n);}
float shadow(vec3 ro,vec3 rd,float mx){float r=1.,t=.03;for(int i=0;i<30;i++){float h=map(ro+rd*t).x;r=min(r,10.*h/t);t+=clamp(h,.04,.8);if(r<.01||t>mx)break;}return clamp(r,0.,1.);}
float ao(vec3 p,vec3 n){float o=0.,s=1.;for(int i=1;i<4;i++){float h=.08*float(i);o+=(h-map(p+n*h).x)*s;s*=.6;}return clamp(1.-2.2*o,0.,1.);}
void matInfo(float m,vec3 p,vec3 n,out vec3 alb,out float rough,out vec3 em){
 em=vec3(0); rough=.8;
 if(m<1.5){ float g=n3(p*2.)*.5+n3(p*9.)*.25; alb=vec3(.08+.05*g); rough=.25+.4*g; } // ıslak asfalt
 else if(m<2.2){ float br=step(.06,fract(p.y*4.))*step(.06,fract((p.z+p.x)*2.+floor(p.y*4.)*.5)); alb=vec3(.22,.2,.19)*(.75+.25*br)*(.8+.3*n3(p*3.)); rough=.9;
   vec2 g=vec2(mod(p.y,3.),mod(p.z+p.x,2.)); vec2 id=floor(vec2(p.y/3.,(p.z+p.x)/2.)); if(g.x>.3&&g.x<1.8&&g.y>.55&&g.y<1.45&&abs(n.x)<.3&&abs(n.y)<.5){ float on=step(.78+SC3.w*.22,h21(id+floor(p.x*.1)*7.)); em=on*vec3(.8,.85,.9)*.5; alb=vec3(.02); rough=.1;} }
 else if(m<2.7){ alb=vec3(.12); rough=.6; vec2 id=floor(vec2(p.y*.6,(p.x+p.z)*.7)); float on=step(.86+SC3.w*.14,h21(id)); em=on*vec3(.7,.75,.8)*.5*step(.2,fract(p.y*.6))*step(.3,fract((p.x+p.z)*.7)); em+=SC2.w*vec3(1.,.4,.1)*exp(-(p.y-SC2.y)*.08)*.6*(.6+.4*n3(p*.3+T)); }
 else if(m<3.5){ alb=vec3(.035,.035,.04); rough=.85; }
 else if(m<4.5){ alb=vec3(.36,.26,.21); rough=.55; }
 else if(m<5.5){ alb=vec3(.03); rough=.7; }
 else if(m<6.5){ alb=vec3(.85,.72,.5); rough=.5; em=vec3(1.,.72,.35)*.18*SC3.x*0.; }
 else if(m<7.5){ alb=vec3(.05,.035,.03); rough=.5; }
 else if(m<8.5){ alb=vec3(.1); rough=.3; }
 else if(m<9.5){ alb=vec3(.3,.22,.15); rough=.7; }
 else if(m<10.5){ alb=vec3(.25,.24,.23)*(.8+.3*n3(p*4.)); rough=.9; }
 else if(m<11.5){ alb=vec3(.16,.13,.11)*(.7+.6*h21(floor(p.xz*30.))); rough=.8; }
 else if(m<12.5){ alb=vec3(.06,.055,.06); rough=.8; }
 else if(m<13.5){ alb=vec3(.02); rough=.3; }
 else if(m<14.5){ alb=vec3(.01); rough=.5; }
 else if(m<15.5){ alb=vec3(.2,.2,.21); rough=.8; }
 else if(m<16.5){ alb=vec3(.8,.6,.3); rough=.2; em=vec3(1.,.75,.4)*2.; }
 else { alb=vec3(.5); }
}
float inscatter(vec3 ro,vec3 rd,vec3 lp,float t){ vec3 q=lp-ro; float b=dot(q,rd); float h=sqrt(max(dot(q,q)-b*b,1e-4)); return (atan((t-b)/h)-atan(-b/h))/h; }
void main(){
 vec2 uv=(gl_FragCoord.xy-R*.5)/R.y; uv=r2(cRoll)*uv;
 vec3 ww=normalize(cT-cP),uu=normalize(cross(ww,vec3(0,1,0))),vv=cross(uu,ww);
 vec3 rd=normalize(uv.x*uu+uv.y*vv+cF*ww), ro=cP;
 vec2 hit=march(ro,rd); float t=hit.x;
 vec3 sky=mix(SKY0,SKY1,pow(clamp(1.-rd.y,0.,1.),3.)); sky+=SC2.w*vec3(1.,.35,.08)*.5*pow(clamp(1.-abs(rd.y+.02)*5.,0.,1.),3.);
 vec3 col=sky;
 if(t<200.){
  vec3 p=ro+rd*t,n=nrm(p,t); vec3 alb,em; float rough; matInfo(hit.y,p,n,alb,rough,em);
  float occ=ao(p,n); col=AMB*alb*occ*(.6+.4*n.y)+em;
  for(int i=0;i<4;i++){ if(i>=NL) break; vec3 lv=L[i].xyz-p; float dl=length(lv); vec3 l=lv/dl; float dif=max(dot(n,l),0.);
    float shd=1.; if(i==0&&dif>0.) shd=shadow(p+n*.02,l,dl);
    vec3 hv=normalize(l-rd); float spe=pow(max(dot(n,hv),0.),mix(80.,6.,rough))*(1.-rough)*1.5;
    float att=L[i].w/(1.+dl*dl);
    col+=LC[i]*att*shd*(alb*dif+spe*dif);
  }
  // kadın: kenar ışıması
  if(hit.y>5.5&&hit.y<7.5){ float fr=pow(1.-max(dot(n,-rd),0.),3.); col+=vec3(1.,.7,.35)*fr*1.2*SC3.x+vec3(1.,.75,.45)*.08*SC3.x; }
  if(hit.y<1.5){ vec3 rr=reflect(rd,n); col+=sky*.15*pow(1.-max(dot(n,-rd),0.),4.); }
  col=mix(col,FOGC,1.-exp(-t*SC.w*0.+t*-SC3.y*0.-t*SC2.z));
 }
 // ışık hüzmeleri (sisli hava)
 for(int i=0;i<4;i++){ if(i>=NL) break; col+=LC[i]*L[i].w*SC2.z*inscatter(ro,rd,L[i].xyz,min(t,60.))*.026; }
 // ton eşleme + seçici renk (sadece sıcak altın tonlar renkli kalır)
 col=col*(2.51*col+.03)/(col*(2.43*col+.59)+.14);
 float lum=dot(col,vec3(.299,.587,.114)); float warm=smoothstep(.04,.22,(col.r-col.b)/(lum+.04));
 col=mix(vec3(lum)*vec3(.96,.99,1.04),col,warm*SC3.z+(1.-SC3.z));
 O=vec4(pow(clamp(col,0.,1.),vec3(.4545)),1.);
}`;
const VS = `#version 300 es
in vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
function mkSh(t, src) { const x = gl.createShader(t); gl.shaderSource(x, src); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; }
{ const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); }
const PROGS = {}; let PR = null, UL = {};
function useProg(key, defs) {
  if (!PROGS[key]) { const src = FS.replace('precision highp float;', 'precision highp float;\n' + defs); const pr = gl.createProgram(); gl.attachShader(pr, mkSh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, mkSh(gl.FRAGMENT_SHADER, src)); gl.bindAttribLocation(pr, 0, 'p'); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr)); PROGS[key] = { pr, ul: {} }; }
  PR = PROGS[key].pr; UL = PROGS[key].ul; gl.useProgram(PR);
}
const u = n => (n in UL) ? UL[n] : (UL[n] = gl.getUniformLocation(PR, n));
// sahne tanımı -> GPU
function setUni(S) {
  gl.uniform2f(u('R'), GW, GH); gl.uniform1f(u('T'), S.t);
  gl.uniform3fv(u('cP'), S.cam.p); gl.uniform3fv(u('cT'), S.cam.t); gl.uniform1f(u('cF'), S.cam.f || 1.6); gl.uniform1f(u('cRoll'), S.cam.roll || 0);
  const Ls = S.lights || []; const LA = new Float32Array(16), LCA = new Float32Array(12);
  Ls.slice(0, 4).forEach((l, i) => { LA.set([l.p[0], l.p[1], l.p[2], l.i], i * 4); LCA.set(l.c, i * 3); });
  gl.uniform4fv(u('L'), LA); gl.uniform3fv(u('LC'), LCA); gl.uniform1i(u('NL'), Math.min(4, Ls.length));
  const JA = new Float32Array(64 * 3), CA = new Float32Array(16), C2 = new Float32Array(16);
  (S.chars || []).slice(0, 4).forEach((ch, i) => { ch.J.forEach((j, k) => JA.set(j, (i * 16 + k) * 3)); CA.set([ch.type, ch.yaw, ch.headYaw || 0, 0], i * 4); C2.set([...(ch.wind || [0, 0]), 0, 0], i * 4); });
  gl.uniform3fv(u('J'), JA); gl.uniform4fv(u('CH'), CA); gl.uniform4fv(u('CH2'), C2);
  const B = S.boxes || [], BA = new Float32Array(96), BSA = new Float32Array(96);
  B.slice(0, 24).forEach((b, i) => { BA.set([b.p[0], b.p[1], b.p[2], b.r || 0], i * 4); BSA.set([b.s[0], b.s[1], b.s[2], b.m || 9], i * 4); });
  gl.uniform4fv(u('BX'), BA); gl.uniform4fv(u('BS'), BSA);
  gl.uniform4fv(u('SC'), S.sc || [1, 0, 0, 0]); gl.uniform4fv(u('SC2'), S.sc2 || [20, 0, .02, 0]); gl.uniform4fv(u('SC3'), S.sc3 || [1, 0, 1, 0]); gl.uniform4fv(u('SC4'), S.sc4 || [0, 0, 0, 0]);
  gl.uniform3fv(u('SKY0'), S.sky0 || [.02, .02, .03]); gl.uniform3fv(u('SKY1'), S.sky1 || [.08, .08, .1]); gl.uniform3fv(u('FOGC'), S.fog || [.05, .05, .06]); gl.uniform3fv(u('AMB'), S.amb || [.06, .06, .07]);
}
function scene3d(S) {
  gl.viewport(0, 0, GW, GH);
  const sc = S.sc || [1, 0, 0, 0], f = [];
  if (sc[0] > 0) f.push('GROUND'); if (sc[1] > 0) f.push('ALLEY'); if (sc[2] > 0) f.push('SKYL'); if (sc[3] !== 0) f.push('ROOF');
  const nb = Math.min(24, (S.boxes || []).length), C = (S.chars || []).slice(0, 4);
  const base = f.map(x => '#define ' + x).join('\n') + `\n#define NBOX ${nb}\n`;
  useProg(f.join('_') + '_b' + nb + '_c0', base + '#define NCH 0\n'); setUni(S); gl.disable(gl.SCISSOR_TEST); gl.drawArrays(gl.TRIANGLES, 0, 3);
  if (C.length) { const rc = humanRect(S); if (rc) {
    const tys = C.map(c => c.type); useProg(f.join('_') + '_b' + nb + '_c' + tys.join(''), base + `#define NCH ${C.length}\n` + tys.map((t, i) => `#define CHT${i} ${t}`).join('\n') + '\n'); setUni(S);
    gl.enable(gl.SCISSOR_TEST); gl.scissor(rc[0], rc[1], rc[2], rc[3]); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.disable(gl.SCISSOR_TEST); } }
  return GLC;
}
// figürlerin (ve key ışık gölgelerinin) ekrandaki dikdörtgeni
function humanRect(S) {
  const C = S.chars || []; if (!C.length) return null;
  const p = S.cam.p, tt = S.cam.t, F = S.cam.f || 1.6; const nrm3 = a => { const l = Math.hypot(...a); return a.map(x => x / l); }, cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const ww = nrm3([tt[0] - p[0], tt[1] - p[1], tt[2] - p[2]]), uu = nrm3(cr(ww, [0, 1, 0])), vv = cr(uu, ww);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, full = false;
  const pr = X => { const d = [X[0] - p[0], X[1] - p[1], X[2] - p[2]], z = dt(d, ww); if (z < .15) { full = true; return; } const sx = dt(d, uu) / z * F, sy = dt(d, vv) / z * F; const px = sx * GH + GW / 2, py = sy * GH + GH / 2; x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); };
  const L0 = (S.lights || [])[0];
  for (const ch of C) for (const j of ch.J) { for (const o of [[0, .32, 0], [.3, 0, 0], [-.3, 0, 0], [0, 0, .3], [0, 0, -.3], [0, -.1, 0]]) pr([j[0] + o[0], j[1] + o[1], j[2] + o[2]]);
    if (L0 && L0.p[1] > j[1] + .05 && !S.noShadowRect) { const k = L0.p[1] / (L0.p[1] - j[1]); const g = [L0.p[0] + (j[0] - L0.p[0]) * k, 0, L0.p[2] + (j[2] - L0.p[2]) * k]; if (Math.hypot(g[0] - j[0], g[2] - j[2]) < 12) pr(g); } }
  const roll = Math.abs(S.cam.roll || 0) * GW * .6;
  if (full) return [0, 0, GW, GH];
  const pad = 24 + roll; x0 = Math.max(0, Math.floor(x0 - pad)); y0 = Math.max(0, Math.floor(y0 - pad)); x1 = Math.min(GW, Math.ceil(x1 + pad)); y1 = Math.min(GH, Math.ceil(y1 + pad));
  if (x1 <= x0 || y1 <= y0) return null; return [x0, y0, x1 - x0, y1 - y0];
}
