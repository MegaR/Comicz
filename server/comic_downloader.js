const storage = require('./storage.js');
const Cache = require('./cache.js');

const comicSources = [
    require('./comic_sources/readcomicsonline_ru.js'),
    require('./comic_sources/comicextra_com.js'),
    require('./comic_sources/readcomiconline_to.js')
];


class ComicDownloader {

    constructor() {
        this.cache = new Cache();
    }

    setup(app) {
        app.post('/downloader/search', (req, res) => {
            this.search(req.body)
                .then(result => res.json(result))
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });

        app.get('/downloader/issueDetails/:issueId/:source/:volumeName/:issue', (req, res) => {
            this.details(
                req.params.issueId,
                req.params.source,
                req.params.volumeName,
                req.params.issue
            ).then(details => res.json(details));
        });

        app.get('/downloader/page/:issueId/:source/:volumeName/:issue/:page?', (req, res) => {
            this.page(
                req.params.issueId,
                req.params.source,
                req.params.volumeName,
                req.params.issue,
                req.params.page)
                .then(result => {
                    res.writeHead(200, {'Content-Type': 'image/jpg' });
                    res.end(result, 'binary');
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });
    }

    async search(data) {
        const cacheResult = this.cache.get('search/'+JSON.stringify(data));
        if(cacheResult) return cacheResult;

        let results = [];
        for(let source of comicSources) {
            try {
                results.push({source: source.name, results: await source.search(data)});
            } catch(error) {
                console.error(error);
            }
        }

        this.cache.store('search/'+JSON.stringify(data), results);
        return results;
    }

    async page(issueId, sourceName, volumeName, issueNr, pageNr) {
        const cachePage = this.cache.get(`page/${issueId}/${sourceName}/${volumeName}/${issueNr}/${pageNr}`);
        if(cachePage) return cachePage;

        const source = comicSources.filter(source=>source.name === sourceName)[0];
        if(!source) {
            throw new Error("Unknown comic source");
        }
        let page = await source.page(volumeName, issueNr, Number(pageNr));

        this.cache.store(`page/${issueId}/${sourceName}/${volumeName}/${issueNr}/${pageNr}`, page);
        return page;
    }

    async details(issueId, sourceName, volumeName, issueNr) {
        const cacheDetails = this.cache.get(`details/${issueId}/${sourceName}/${volumeName}/${issueNr}`);
        if(cacheDetails) return cacheDetails;

        const source = comicSources.filter(source=>source.name === sourceName)[0];
        if(!source) {
            throw new Error("Unknown comic source");
        }

        let details = await source.details(volumeName, issueNr);
        details.progress = Number(await storage.getProgress(issueId));

        this.cache.store(`details/${issueId}/${sourceName}/${volumeName}/${issueNr}`, details);
        return details;
    }
}

module.exports = new ComicDownloader();