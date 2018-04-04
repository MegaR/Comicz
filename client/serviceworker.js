var CACHE_NAME = 'comicz-cache';

var filesToCache = [
    '/',
    '/public/bundle.js',
    '/serviceworker.js'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(filesToCache);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function() {
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    if (!shouldCache(event.request)) return;

    if (cacheFirst(event.request)) {
        event.respondWith(
            caches.match(event.request, {ignoreSearch: true})
                .then(function (response) {
                    if (response) {
                        return response;
                    } else {
                        return request(event.request);
                    }
                })
        );
    } else {
        //request first
        event.respondWith(
            request(event.request).catch(error => {
                console.warn(error);
                return caches.match(event.request, {ignoreSearch: true})
                    .then(function (response) {
                        if (response) {
                            return response;
                        } else {
                            throw error;
                        }
                    });
            }));
    }

});

function shouldCache(request) {
    return request.method === 'GET';
}

function cacheFirst(request) {
    return false;
    // return !request.url.includes('/api/comicvine/');
}

function request(request) {
    var reqCopy = request.clone();

    return fetch(reqCopy)
        .then(function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            cacheRequest(reqCopy, response.clone());
            return response;
        });
}

function cacheRequest(request, response) {
    caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.put(request, response);
        })
        .catch(function (error) {
            console.error('failed to cache', error, request);
        });
}