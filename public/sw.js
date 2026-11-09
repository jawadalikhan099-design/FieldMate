self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// Always use the network for account pages and records. Never cache private data.
self.addEventListener('fetch',event=>{if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width"><title>FieldMate</title><body style="font:18px system-ui;background:#edf1ed;color:#21775c;padding:40px"><h1>FieldMate</h1><p>You are offline. Connect to the internet to open your records.</p><button onclick="location.reload()">Try again</button></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'}})))}});
