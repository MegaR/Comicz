class Cache {
    constructor() {
        this.cache = {};
    }

    store(url, data) {
        this.cache[url] = data;
    }

    get(url) {
        return this.cache[url];
    }
}

module.exports = Cache;