import sys, numpy as np, json, subprocess
mp3, out = sys.argv[1], sys.argv[2]
raw = out + '/_a.raw'
subprocess.run(['ffmpeg','-v','error','-i',mp3,'-ac','1','-ar','22050','-f','f32le',raw,'-y'],check=True)
x=np.fromfile(raw,dtype=np.float32); sr=22050; FPS=24; hop=sr/FPS; n=int(len(x)/hop); win=2048; w=np.hanning(win); fr=np.fft.rfftfreq(win,1/sr)
B=[];H=[];R=[]
for i in range(n):
    s=int(i*hop); seg=x[s:s+win]
    if len(seg)<win: seg=np.pad(seg,(0,win-len(seg)))
    sp=np.abs(np.fft.rfft(seg*w)); B.append(sp[(fr>40)&(fr<160)].sum()); H.append(sp[(fr>3000)&(fr<9000)].sum()); R.append(np.sqrt((seg**2).mean()))
def norm(a,sm=0):
    a=np.array(a,float)
    if sm:a=np.convolve(a,np.ones(sm)/sm,mode='same')
    return a/np.percentile(a,98)
B=norm(B);H=norm(H);R=norm(R,5)
on=np.maximum(0,np.diff(B,prepend=B[0]));K=np.zeros(n);thr=np.percentile(on,80);last=-10
for i in range(n):
    if on[i]>thr and i-last>3:last=i;K[i]=1
for i in range(1,n):K[i]=max(K[i],K[i-1]*0.8)
hop2=sr//100;b2=[]
for i in range(len(x)//hop2-10):
    seg=x[i*hop2:i*hop2+1024];sp=np.abs(np.fft.rfft(seg*np.hanning(1024)));f=np.fft.rfftfreq(1024,1/sr)
    b2.append(sp[(f>40)&(f<200)].sum()+0.3*sp[(f>200)&(f<4000)].sum())
o=np.diff(np.array(b2));o=np.maximum(o,0);o-=o.mean();o=o[3000:min(len(o),9000)]
ac=np.correlate(o,o,'full')[len(o)-1:]
res=sorted([(ac[int(round(60/b*100))]+0.5*ac[int(round(120/b*100))],b) for b in range(70,170)],reverse=True)[:3]
bpm=res[0][1];per=60/bpm;best=(0,0)
for ph in np.arange(0,per,0.01):
    sc=sum(on[i]*np.exp(-(min((i/24-ph)%per,per-(i/24-ph)%per)/0.05)**2) for i in range(20*24,min(n,90*24)))
    if sc>best[0]:best=(sc,ph)
open(out+'/energy.js','w').write('const ENERGY='+json.dumps({'fps':24,'bpm':int(bpm),'ph':float(best[1]),'e':[round(float(v),3) for v in np.clip(R,0,1.3)],'b':[round(float(v),3) for v in np.clip(B,0,1.3)],'h':[round(float(v),3) for v in np.clip(H,0,1.3)],'k':[round(float(v),3) for v in K]},separators=(',',':'))+';')
sec=int(len(x)/sr); e=[float(np.sqrt((x[i*sr:(i+1)*sr]**2).mean())) for i in range(sec)]; m=max(e)
print('bpm',bpm,'ph',round(best[1],2),'frames',n,'dur',round(len(x)/sr,1))
print(' '.join(f"{i}:{int(e[i]/m*9)}" for i in range(sec)))
