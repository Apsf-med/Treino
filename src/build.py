# Monta o index.html a partir das partes em src/ (python3 src/build.py)
import os
D=os.path.dirname(os.path.abspath(__file__)); R=os.path.dirname(D)
r=lambda f:open(os.path.join(D,f),encoding='utf-8').read()
t=r('index.tpl.html')
for k,v in {'{{CSS}}':r('base.css')+r('extra.css'),'{{COACH}}':r('coach.js'),'{{DATA}}':r('data.js'),'{{EXDB}}':r('exdb.js'),'{{APP}}':r('app.js')}.items():
    t=t.replace(k,v)
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write(t)
print('index.html',len(t)//1024,'KB')
