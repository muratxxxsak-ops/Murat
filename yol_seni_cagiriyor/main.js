const cv=document.getElementById('cv'),ctx=cv.getContext('2d');
window.renderFrame=f=>{const t=f/24;setAudio(t);const c=ctx;c.setTransform(1,0,0,1,0,0);c.fillStyle='#000';c.fillRect(0,0,W,H);sceneTest(c,t);};
