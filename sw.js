/* O cache do app não contém os dados dos animais. Eles ficam no IndexedDB. */
const PREFIX='alta-cria-coleta-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'v2.3.0-7695afc118';
const ARQUIVOS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/api/')||url.pathname.endsWith('/healthz'))return;
 e.respondWith(caches.open(CACHE).then(async c=>{
  const hit=await c.match(e.request);if(hit)return hit;
  try{const r=await fetch(e.request);if(r.ok&&url.pathname.startsWith(new URL(self.registration.scope).pathname))await c.put(e.request,r.clone());return r;}
  catch{return e.request.mode==='navigate'?(await c.match('./index.html'))||Response.error():Response.error();}
 }));
});
