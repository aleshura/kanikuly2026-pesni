// Этот адрес больше не приложение, а редирект-заглушка на новый адрес
// (https://clrussia.github.io/pesennik/) -- никакого офлайн-кэша тут не
// нужно. Задача этого service worker'а — один раз аккуратно снять сам
// себя и очистить всё, что закешировал предыдущий (offline-cache-v3),
// чтобы у уже установивших приложение ничего не мешало редиректу.
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll(); })
      .then(function (clients) {
        clients.forEach(function (client) { client.navigate(client.url); });
      })
  );
});
