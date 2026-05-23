const CACHE='ornidex-v8';
const ASSETS=['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(url.includes('inaturalist.org')||url.includes('xeno-canto.org')||url.includes('tile.openstreetmap')){
    e.respondWith(fetch(e.request).then(r=>{const cl=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cl));return r;}).catch(()=>caches.match(e.request).then(c=>c||new Response('',{status:503}))));
    return;
  }
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const cl=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,cl));return r;})));
});
