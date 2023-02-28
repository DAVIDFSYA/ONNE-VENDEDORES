let GlobalSelectedForm = 'viewLogin';
let GlobalBool = 0;

var CACHE = 'onneventas';
const staticAssets = [
  './',
  './manifest.json',
  './favicon.png',
  './assets/img/usuario.png',
  './assets/img/favicon.png',
   './index.html',
  './sw.js'
];

self.addEventListener('install', function(evt) {
  //console.log('Service worker instalado');
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll(staticAssets);
  }));
});

self.addEventListener('fetch', function(evt) {
 return;

  if (navigator.onLine){
    var req = evt.request.clone();
    if (req.clone().method == "GET") {
      evt.waitUntil(update(evt.request));
    }
  }else{
    var req = evt.request.clone();
    if (req.clone().method == "GET") {
      evt.respondWith(fromCache(evt.request));
    }
  }

});


function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}

async function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request)
        .then(function (response) {
          return cache.put(request, response.clone())
                      .then(function () {
                        //console.log('Cache actualizado');
          return response;
      });
    });
  });
}
    

