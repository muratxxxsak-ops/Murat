import cv2, numpy as np, sys
SP='/tmp/claude-0/-home-user-Murat/be7b2fb3-6ce3-5538-952c-d6351bbedfb7/scratchpad/'
def run(n, rect, core, fillbox, wheels, iters=10, maxhole=9000, fgpoly=None, trims=None):
    im=cv2.imread(f'photos/p{n}.jpg'); H,W=im.shape[:2]; s=0.5
    sm=cv2.resize(im,None,fx=s,fy=s,interpolation=cv2.INTER_AREA); h,w=sm.shape[:2]
    mask=np.full((h,w),cv2.GC_BGD,np.uint8)
    x0,y0,x1,y1=[int(v*s) for v in rect]; mask[y0:y1,x0:x1]=cv2.GC_PR_BGD
    cx0,cy0,cx1,cy1=[int(v*s) for v in core]; mask[cy0:cy1,cx0:cx1]=cv2.GC_PR_FGD
    if fgpoly is not None: cv2.fillPoly(mask,[(np.array(fgpoly)*s).astype(np.int32)],int(cv2.GC_FGD))
    bg=np.zeros((1,65)); fg=np.zeros((1,65)); cv2.grabCut(sm,mask,None,bg,fg,iters,cv2.GC_INIT_WITH_MASK)
    m=((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD)).astype(np.uint8)
    # en büyük bileşen
    nl,lab,st,_=cv2.connectedComponentsWithStats(m); 
    if nl>1: k=1+np.argmax(st[1:,cv2.CC_STAT_AREA]); m=(lab==k).astype(np.uint8)
    # gövde içindeki küçük/orta boşlukları doldur (tekerlekler hariç)
    inv=1-m; nl,lab,st,cen=cv2.connectedComponentsWithStats(inv)
    fb=[int(v*s) for v in fillbox]
    for k in range(1,nl):
        x,y,ww,hh,a=st[k]; touches=x==0 or y==0 or x+ww>=w or y+hh>=h
        if touches: continue
        cxk,cyk=cen[k]
        inwheel=any((cxk-wx*s)**2+(cyk-wy*s)**2<(wr*s)**2 for wx,wy,wr in wheels)
        if (not inwheel) and fb[0]<=cxk<=fb[2] and fb[1]<=cyk<=fb[3] and a<maxhole*0.25: m[lab==k]=1
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
    if trims:
        for (tx0,ty0,tx1,ty1) in trims: m[int(ty0*s):int(ty1*s),int(tx0*s):int(tx1*s)]=0
        yy,xx=np.mgrid[0:h,0:w]; low=(yy>1425*s); near=np.zeros((h,w),bool)
        for wx,wy,wr in wheels: near|=((xx-wx*s)**2+(yy-wy*s)**2)<((wr+12)*s)**2
        near|=((xx>560*s)&(xx<760*s)&(yy<1460*s))
        m[low&~near]=0
    big=cv2.resize(m*255,(W,H),interpolation=cv2.INTER_LINEAR)
    big=cv2.GaussianBlur(big,(0,0),2.0); _,bt=cv2.threshold(big,127,255,cv2.THRESH_BINARY)
    if n==1:
        hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV); V=hsv[:,:,2]; reg=np.zeros((H,W),bool); reg[1384:,400:1045]=True; bt[reg&(V>100)]=0; bt[1290:1385,0:150]=0
    bt=cv2.erode(bt,np.ones((3,3),np.uint8)); al=cv2.GaussianBlur(bt,(0,0),1.6)
    rgba=cv2.cvtColor(im,cv2.COLOR_BGR2BGRA); rgba[:,:,3]=al
    ys,xs=np.where(al>10); bx0,bx1,by0,by1=xs.min(),xs.max(),ys.min(),ys.max()
    rgba=rgba[by0:by1+1,bx0:bx1+1]; cv2.imwrite(f'cut/c{n}.png',rgba); print(n,'bbox',bx0,by0,bx1,by1)
    prev=np.full(rgba.shape[:2]+(3,),(40,140,40),np.uint8); a=rgba[:,:,3:4]/255.0; prev=(rgba[:,:,:3]*a+prev*(1-a)).astype(np.uint8)
    cv2.imwrite(SP+f'cut{n}.jpg',cv2.resize(prev,None,fx=0.45,fy=0.45,interpolation=cv2.INTER_AREA))
run(1,(30,700,1340,1530),(450,1000,1000,1400),(330,880,1180,1420),[(307,1300,200),(1170,1350,190)],fgpoly=[(430,970),(660,950),(920,910),(980,900),(1120,950),(1220,1000),(1210,1080),(1080,1120),(960,1210),(880,1380),(660,1360),(600,1320),(660,1240),(500,1110),(400,1040)],trims=[(0,1380,175,1540),(480,1398,600,1540),(700,1398,990,1540)])
#run(2,(60,420,1100,2040),(250,850,800,1500),(120,700,1000,1700),[(327,1696,240)])
#run(3,(100,250,1800,1880),(500,850,1300,1500),(300,500,1600,1500),[(263,1608,230),(1316,1243,200)])
