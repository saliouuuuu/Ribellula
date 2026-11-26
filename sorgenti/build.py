import json,re,base64
R=json.load(open('script-ribellula.json')); C=json.load(open('script-chiara.json')); E=json.load(open('script-ete.json'))
M=json.load(open('script-conme.json')); L=json.load(open('script-cara.json'))
liner=open('liner.uri').read()
s=open('site/index.src.html').read()
for k,v in {'RW':R['w'],'RH':R['h'],'RD':R['d'],'CW':C['w'],'CH':C['h'],'CD':C['d'],'EW':E['w'],'EH':E['h'],'ED':E['d'],'MW':M['w'],'MH':M['h'],'MD':M['d'],'LW':L['w'],'LH':L['h'],'LD':L['d']}.items():
    s=s.replace('{{'+k+'}}',str(v))
assert '{{' not in s
open('site/index.html','w').write(s)
css=open('site/assets/app.css').read().replace('{{LINER}}',liner)
assert '{{' not in css
open('site/assets/app.out.css','w').write(css)
# versione anteprima: CSS, JS e font dentro la pagina, immagini come file
def font(m):
    return 'url("data:font/woff2;base64,'+base64.b64encode(open('site/assets/fonts/'+m.group(1),'rb').read()).decode()+'")'
icss=re.sub(r'url\("fonts/([^"]+)"\)',font,css).replace('url("img/','url("assets/img/')
js=open('site/assets/app.js').read()
assert '</script' not in js and '</style' not in icss
m=re.search(r'<head>(.*?)</head>\s*<body>(.*)</body>\s*</html>',s,re.S)
head=m.group(1); body=m.group(2)
head=re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*','',head)
head=re.sub(r'<link rel="preload" href="assets/fonts/[^>]*>\s*','',head)
head=head.replace('<title>Ribellula Yoga · Chiara · Alba e online</title>','<title>Demo Ribellula Yoga</title>\n<meta name="claude:viewport-fit-sides" content="cover">')
head=head.replace('<link rel="stylesheet" href="assets/app.out.css">','<style>\n'+icss+'\n</style>')
body=body.replace('<script src="assets/app.js"></script>','<script>\n'+js+'\n</script>')
out=head.strip()+'\n'+body.strip()+'\n'
open('site/anteprima.html','w').write(out)
open('site/anteprima-test.html','w').write('<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>'+out+'</body></html>')
imgs=sorted(set(re.findall(r'assets/img/[\w-]+\.(?:webp|png)',out)))
json.dump(imgs,open('imgs.json','w'))
print('ok index',len(s),'anteprima',len(out),'imgs',len(imgs))
