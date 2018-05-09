var VERSION = 'v6'

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        '/sw-test/style.css',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg',
        '/sw-test/gallery/child.jpg',
        'https://s1.hdslb.com/bfs/static/jinkela/blackroom/images/jury-s.png'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {  
  event.waitUntil(
    // 获取所有 cache 名称
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        // 获取所有不同于当前版本名称 cache 下的内容
        cacheNames.filter(function(cacheName) {
          return cacheName != currentCacheName;
        }).map(function(cacheName) {
          // 删除内容
          return caches.delete(cacheName);
        })
      ); // end Promise.all()
    }) // end caches.keys()
  ); // end event.waitUntil()
});

self.addEventListener('fetch', function(event) {
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
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});
