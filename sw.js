const V='kzg-v3',CORE=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
const put=(r,x)=>caches.open(V).then(c=>c.put(r,x));
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x.startsWith('kzg-')).map(x=>caches.delete(x)))).then(()=>clients.claim())));
// Halaman utama: ambil versi terbaru dulu (cadangan cache saat offline). Aset lain: cache dulu, perbarui di belakang.
const swr=(e,key)=>{const net=fetch(e.request).then(x=>{if(x.ok||x.type==='opaque')put(key,x.clone());return x});e.waitUntil(net.catch(()=>{}));return caches.match(key).then(h=>h||net)};
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(r.mode==='navigate')e.respondWith(fetch(r,{cache:'no-cache'}).then(x=>{if(x.ok)put('index.html',x.clone());return x}).catch(()=>caches.match('index.html')));
 else if(u.origin===location.origin||/(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname))e.respondWith(swr(e,r).catch(()=>caches.match(r)));
});
