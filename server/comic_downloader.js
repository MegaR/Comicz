const storage = require('./storage.js');
const Cache = require('./cache.js');
const archiver = require('archiver');
const stream = require('stream');

const comicSources = [
    require('./comic_sources/readcomicsonline_ru.js'),
    require('./comic_sources/comicextra_com.js'),
    require('./comic_sources/readcomicsonline_me')
];


class ComicDownloader {

    constructor() {
        this.cache = new Cache();
    }

    setup(app) {
        app.get('/downloader/search/:source/:volumeName', (req, res) => {
            this.search(req.params.source, req.params.volumeName)
                .then(result => res.json(result))
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });

        app.get('/downloader/sources', (req, res) => {
            res.json(comicSources.map(source => source.name));
        });

        app.get('/downloader/issueDetails/:issueId/:source/:volumeName/:issue', (req, res) => {
            this.details(
                req.params.issueId,
                req.params.source,
                req.params.volumeName,
                req.params.issue
            ).then(details => res.json(details))
            .catch(error => {
                console.error(error);
                res.status(500).json(error);
            });
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

        app.get('/downloader/download/:issueId/:source/:volumeName/:issue', (req, res) => {
            const stream = this.getFileStream(req.params.volumeName, req.params.issueId, res);
            this.download(
                req.params.issueId,
                req.params.source,
                req.params.volumeName,
                req.params.issue,
                stream
            )
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });
    }

    async search(sourceName, volumeName) {
        const cacheResult = this.cache.get(`search/${sourceName}/${volumeName}`);
        if(cacheResult) {return cacheResult;}

        let source = comicSources.filter(item => item.name == sourceName)[0];

        let results;
        try {
            results = await source.search(volumeName);
        } catch(error) {
            console.error(error);
            return [];
        }
        
        this.cache.store(`search/${sourceName}/${volumeName}`, results);
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

    async download(issueId, sourceName, volumeName, issueNr, stream) {
        let archive = archiver('zip', {zlib: {level: 9}});

        archive.on('warning', function(err) {
            console.warn('archive', err);
        });

        archive.pipe(stream);

        const details = await this.details(issueId, sourceName, volumeName, issueNr);
        for(let i = 0; i < details.totalPages; i++) {
            let filename = i + '';
            while(filename.length < 3) filename = '0' + filename;
            filename += '.jpg';
            const page = await this.page(issueId, sourceName, volumeName, issueNr, i);
            archive.append(page, {name: filename});
        }

        archive.finalize();
    }

    getFileStream(volumeName, issueNr, response) {
        while(issueNr.length < 3) issueNr = 0+issueNr;
        const filename = `${volumeName}_issue-${issueNr}.cbz`;
        response.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${filename}"`
        });

        const writable = stream.Writable();
        writable.write = (chunk, encoding, next) => {
            response.write(chunk);
            if(next) next();
        };

        writable.end = () => {
            response.end();
        };

        return writable;
    }
}

module.exports = new ComicDownloader();