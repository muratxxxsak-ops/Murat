# Ninni: yapay ses (Piper) + sentezlenmiş piyano/ambiyans -> story.wav ve timeline.js
import json, subprocess, os, numpy as np, wave, sys
HERE = os.path.dirname(os.path.abspath(__file__)); AUD = os.path.join(HERE, 'audio'); os.makedirs(AUD, exist_ok=True)
MODEL = '/tmp/claude-0/tts/tr_TR-dfki-medium.onnx'
SR = 44100
script = json.load(open(os.path.join(HERE, 'script.json')))
VOICE = {  # length_scale, pitch, ffmpeg ek filtre, kazanç
  'N': (1.12, .97, 'lowpass=7500,aecho=0.8:0.4:35:0.12', 1.0),
  'Y': (1.12, 1.0, 'lowpass=8000', .9),
  'YB': (.95, 1.03, 'highpass=150', 1.5),
  'YS': (1.7, 1.0, 'lowpass=6500,aecho=0.8:0.5:60:0.2', .8),
  'H': (1.35, .84, 'vibrato=f=5.5:d=0.12,lowpass=6000', 1.0),
  'HS': (1.7, .84, 'vibrato=f=5:d=0.15,lowpass=5500,aecho=0.8:0.5:60:0.2', .85),
  'HG': (1.55, .92, 'lowpass=6000,aecho=0.8:0.6:70:0.25', .8),
  'A': (.98, 1.12, 'lowpass=8000', .95),
}
def tts(i, who, text):
  ls, pitch, flt, g = VOICE[who]; raw = os.path.join(AUD, f'{i:02d}_raw.wav'); out = os.path.join(AUD, f'{i:02d}.wav')
  if not os.path.exists(out):
    subprocess.run(['python3', '-m', 'piper', '-m', MODEL, '--length-scale', str(ls), '--sentence-silence', '0.25', '-f', raw], input=text.encode(), check=True, capture_output=True)
    af = f'asetrate=22050*{pitch},aresample={SR},atempo={1 / pitch:.4f},{flt},volume={g}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', af, '-ac', '1', '-ar', str(SR), out], check=True)
  w = wave.open(out); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768; return a
# --- zaman çizelgesi ---
items, t, voice = [], 0.0, []
for i, it in enumerate(script):
  sc, who = it[0], it[1]
  if who == 'amb': items.append({'s': sc, 'who': 'amb', 'tag': it[3], 'a': t, 'b': t + it[2]}); t += it[2]; continue
  a = tts(i, who, it[2]); d = len(a) / SR
  items.append({'s': sc, 'who': who, 'text': it[2], 'a': round(t, 3), 'b': round(t + d, 3)}); voice.append((t, a)); t += d + it[3]
T = t; N = int(T * SR) + SR
V = np.zeros(N, np.float32)
for st, a in voice: i0 = int(st * SR); V[i0:i0 + len(a)] += a
scenes = {}
for it in items: s = scenes.setdefault(it['s'], [it['a'], it['b']]); s[0] = min(s[0], it['a']); s[1] = max(s[1], it['b'])
print('toplam', round(T, 1), 's', {k: [round(v[0], 1), round(v[1], 1)] for k, v in scenes.items()})
# --- müzik sentezi ---
rng = np.random.default_rng(3)
M = np.zeros(N, np.float32); AMB = np.zeros(N, np.float32)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def piano(t0, m, dur, vel=.3, buf=M):
  n = int(min(dur + 2.5, 6) * SR); tt = np.arange(n) / SR; f = midi(m); s = np.zeros(n, np.float32)
  for k in range(1, 7): s += (1 / k ** 1.6) * np.sin(2 * np.pi * f * k * tt * (1 + .0007 * k)) * np.exp(-tt * (1.1 + k * .7))
  s *= np.minimum(1, tt / .006) * vel; rel = tt > dur; s[rel] *= np.exp(-(tt[rel] - dur) * 4)
  i0 = int(t0 * SR); e = min(N, i0 + n); buf[i0:e] += s[:e - i0]
def pad(t0, notes, dur, vel=.06, buf=M):
  n = int(dur * SR); tt = np.arange(n) / SR; s = np.zeros(n, np.float32)
  for m in notes: f = midi(m); s += np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * f * 2 * tt + .3) + .15 * np.sin(2 * np.pi * f * 1.003 * tt)
  env = np.minimum(1, tt / 1.5) * np.minimum(1, (dur - tt) / 1.5); i0 = int(t0 * SR); e = min(N, i0 + n); buf[i0:e] += (s * env * vel)[:e - i0]
BEAT = 60 / 72
MEL = [(64, 1), (67, 1), (69, 1), (67, 2), (64, 1), (62, 1), (64, 1), (67, 1), (64, 3), (60, 1), (62, 1), (64, 1), (67, 2), (69, 1), (67, 1), (64, 1), (62, 1), (60, 3)]
CH = [[48, 55, 64], [45, 52, 60], [43, 50, 59], [48, 55, 64], [41, 48, 57], [48, 55, 64], [43, 50, 59], [48, 55, 64]]
def lullaby(t0, t1, vel=.28, mel=True, oct=0):
  t = t0
  while t < t1 - 1:
    b = t
    for bi, ch in enumerate(CH):
      if b > t1 - .5: break
      for j, m in enumerate(ch): piano(b + j * BEAT, m - 12 + oct, BEAT * 2.5, vel * .55)
      b += 3 * BEAT
    if mel:
      b = t
      for m, d in MEL:
        if b > t1 - .5: break
        piano(b, m + oct, d * BEAT, vel); b += d * BEAT
    t += 24 * BEAT
def minorChords(t0, t1, vel=.2):
  prog = [[45, 52, 60, 64], [41, 48, 57, 60], [48, 55, 60, 64], [43, 50, 55, 59]]; t = t0; k = 0
  while t < t1 - 1:
    ch = prog[k % 4]
    for j, m in enumerate(ch): piano(t + j * .45, m, 2.6, vel * (1 - j * .1))
    pad(t, ch[:2], 3.8, .02); t += 3.6; k += 1
sc = scenes
minorChords(sc['S1'][0], sc['S1'][1], .22)
lullaby(sc['S2'][0], sc['S2'][1] + 1, .26); pad(sc['S2'][0], [48, 55, 64], sc['S2'][1] - sc['S2'][0] + 1, .03)
t = sc['S3'][0]
while t < sc['S3'][1]: piano(t, 45, 3, .18); piano(t + 1.8, 52, 2, .1); t += 4.2
minorChords(sc['S4'][1] - 14, sc['S4'][1], .16)
# yağmur: önce gerilim, bankta yumuşak piyano
bank = [it for it in items if it['who'] == 'amb' and it['tag'] == 'bank'][0]['a']
t = sc['S5'][0]
while t < bank: piano(t, 38, .4, .25); piano(t + .35, 38, .4, .18); t += 1.1
minorChords(bank, sc['S5'][1] + 1, .18)
lullaby(sc['S6'][0] + 1, sc['S6'][1], .12)
lullaby(sc['S7'][0], sc['END'][1] - 1, .24); pad(sc['S7'][0], [48, 55, 64, 67], sc['END'][1] - sc['S7'][0], .035)
piano(sc['END'][1] - 4.5, 36, 4, .3); piano(sc['END'][1] - 4.5, 48, 4, .25); piano(sc['END'][1] - 4.5, 64, 4, .2); piano(sc['END'][1] - 4.5, 72, 4, .15)
# --- ambiyans ---
def noise(n): return rng.standard_normal(n).astype(np.float32)
def onepole(x, a):
  from scipy.signal import lfilter
  return lfilter([1 - a], [1, -a], x).astype(np.float32)
def birds(t0, t1):
  t = t0 + 1
  while t < t1:
    n = int(.12 * SR); tt = np.arange(n) / SR; f0 = 2600 + rng.random() * 1500; s = np.sin(2 * np.pi * (f0 + 900 * np.sin(tt * 40)) * tt) * np.sin(np.pi * tt / .12) * .05
    for r in range(int(1 + rng.random() * 3)): i0 = int((t + r * .16) * SR); AMB[i0:i0 + n] += s
    t += 1.5 + rng.random() * 3
birds(sc['S1'][0], sc['S1'][1]); birds(sc['S7'][0], sc['END'][0])
# fabrika
a, b = int(sc['S4'][0] * SR), int(sc['S4'][1] * SR); n = b - a; tt = np.arange(n) / SR
hum = (np.sin(2 * np.pi * 55 * tt) * .5 + np.sin(2 * np.pi * 110 * tt) * .3) * .06 + onepole(noise(n), .97) * .25
for k in range(int(n / SR / .75)):
  i0 = a + int(k * .75 * SR); m = int(.18 * SR); cl = noise(m) * np.exp(-np.arange(m) / SR * 25) * (.15 if k % 4 else .3); AMB[i0:i0 + m] += cl[:max(0, min(m, N - i0))]
AMB[a:b] += hum
# yağmur
a, b = int(sc['S5'][0] * SR), int(sc['S5'][1] * SR + 2 * SR); n = b - a
rain = onepole(noise(n), .55) * .18 + onepole(noise(n), .9) * .25; env = np.minimum(1, np.arange(n) / SR / 1.5) * np.minimum(1, (n - np.arange(n)) / SR / 2)
AMB[a:b] += rain * env
# kapı gıcırtısı ve sabah sesleri kısa vurgular yok; yatak sahnesinde saat tıkırtısı
a, b = sc['S6'][0], sc['S6'][1]; t = a
while t < b: i0 = int(t * SR); m = int(.02 * SR); AMB[i0:i0 + m] += noise(m) * np.exp(-np.arange(m) / SR * 300) * .08; t += 1.0
# --- karıştırma: konuşurken müziği kıs ---
env = np.abs(V); env = onepole(env, .9995); duck = 1 - np.clip(env * 6, 0, .55)
mix = V * 1.0 + M * .55 * duck + AMB * .8 * (1 - (1 - duck) * .5)
mix /= max(1e-6, np.percentile(np.abs(mix), 99.95)) / .9
mix = np.clip(mix, -1, 1)
wv = wave.open(os.path.join(HERE, 'story.wav'), 'w'); wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes((mix * 32767).astype(np.int16).tobytes()); wv.close()
# görüntü için: zaman çizelgesi + konuşma zarfı (24 fps)
fps = 24; nf = int(T * fps) + fps; ve = [float(np.abs(V[int(i * SR / fps):int((i + 1) * SR / fps)]).mean()) for i in range(nf)]; mx = np.percentile(ve, 98) or 1
open(os.path.join(HERE, 'timeline.js'), 'w').write('const TL=' + json.dumps(items, ensure_ascii=False) + ';\nconst SCN=' + json.dumps(scenes) + ';\nconst VOX=' + json.dumps([round(min(1, v / mx), 3) for v in ve]) + ';\nconst T_END=' + str(round(T, 2)) + ';\n')
