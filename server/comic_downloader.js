const storage = require('./storage.js');

const comicSources = [
    require('./comic_sources/readcomiconline_to.js'),
    require('./comic_sources/readcomics_website.js')
];


class ComicDownloader {
    setup(app) {
        app.post('/api/search', (req, res) => {
            this.search(req.body)
                .then(result => res.json(result))
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });

        app.get('/api/issueDetails/:issueId/:source/:volumeName/:issue', (req, res) => {
            this.details(
                req.params.issueId,
                req.params.source,
                req.params.volumeName,
                req.params.issue
            ).then(details => res.json(details));
        });

        app.get('/api/page/:issueId/:source/:volumeName/:issue/:page?', (req, res) => {
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
        let results = [];
        for(let source of comicSources) {
            try {
                results.push({source: source.name, results: await source.search(data)});
            } catch(error) {
                console.error(error);
            }
        }

        return results;
    }

    async page(issueId, sourceName, volumeName, issueNr, pageNr) {
        console.log('hello', new Date());
        const source = comicSources.filter(source=>source.name === sourceName)[0];
        if(!source) {
            throw new Error("Unknown comic source");
        }
        let page = await source.page(volumeName, issueNr, Number(pageNr));
        console.log('got buffer', new Date());
        return page;
    }

    async details(issueId, sourceName, volumeName, issueNr) {
        const source = comicSources.filter(source=>source.name === sourceName)[0];
        if(!source) {
            throw new Error("Unknown comic source");
        }

        let details = await source.details(volumeName, issueNr);
        details.progress = Number(await storage.getProgress(issueId));

        return details;
    }
}

module.exports = new ComicDownloader();