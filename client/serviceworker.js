var CACHE_NAME = 'comicz-cache';

var filesToCache = [
    '/',
    '/public/bundle.js'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    if (!shouldCache(event.request)) return;

    if (cacheFirst(event.request)) {
        event.respondWith(
            caches.match(event.request)
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
                return caches.match(event.request)
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
    return !request.url.includes('/api/comicvine/');
}

function request(request) {
    var reqCopy = request.clone();

    return fetch(reqCopy, {credentials: 'same-origin', mode: 'cors'})
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