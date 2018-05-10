var VERSION = 'versionv10'

self.addEventListener('install', function(event) {
  console.log('install loop')
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg',
        '/sw-test/gallery/child.jpg',
        '//s1.hdslb.com/bfs/static/jinkela/blackroom/images/jury-s.png',
        '//s1.hdslb.com/bfs/static/judgement/static/img/fjw-banner3.e165f82.png',
        '//h.hiphotos.baidu.com/image/h%3D300/sign=777ba8a7b0315c605c956defbdb0cbe6/a5c27d1ed21b0ef48c509cecd1c451da80cb3ec3.jpg'
      ]);
    })
  );
});
self.addEventListener('activate', function(event) {
  console.log('activate loop')
})
self.addEventListener('fetch', function(event) {
  console.log('fetch loop')
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open(VERSION).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});
