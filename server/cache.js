class Cache {
    constructor(timeoutTime = 1000*60*60*12) {
        this.timeoutTime = timeoutTime;
        this.cache = {};
        this.timeouts = {};
    }

    store(url, data) {
        clearTimeout(this.timeouts[url]);

        this.cache[url] = data;

        this.timeouts[url] = setTimeout(()=>{
            delete this.cache[url];
            delete this.timeouts[url];
        }, this.timeoutTime);
    }

    get(url) {
        return this.cache[url];
    }
}

module.exports = Cache;