const Cache = require('./cache.js');
const fetch = require('node-fetch');
const storage = require('./storage.js');

//todo move api key to environment
const apiKey = process.env['comicvine_api'];
const baseUrl = 'https://comicvine.gamespot.com/api/';

const volumeId = 4050;
const issueId = 4000;
// const characterId = 4005;

class comicVine {
    constructor() {
        this.cache = new Cache();
    }

    setup(app) {
        app.get('/api/comicvine/search/:query', (req, res) => {
            this.search(req.params.query)
                .then(result => res.json(result))
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });

        app.get('/api/comicvine/volume/:id', (req, res) => {
            this.volume(Number(req.params.id))
                .then(result => res.json(result))
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });

        app.get('/api/comicvine/issue/:id', (req, res) => {
            let data;

            this.issue(req.params.id)
                .then(result => {
                    data = result;
                    return storage.getIssue(req.params.id);
                })
                .then(result => {
                    res.json(Object.assign(data, result));
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });

        // app.get('/api/comicvine/character/:id', (req, res) => {
        //     this.character(req.params.id)
        //         .then(result => res.json(result))
        //         .catch(error => {
        //             console.error(error);
        //             res.status(500).json(error);
        //         });
        // });

        app.get('/api/comicvine/trackedVolumes', (req, res) => {
            this.trackedVolumes()
                .then(result => res.json(result))
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                })
        });
    }

    async volume(id) {
        let data = await this.request('volume/' + volumeId + '-' + id);
        let volume = this.parseVolume(data.results);
        volume = Object.assign(volume, await storage.getVolume(id));

        // const charIds = data.results.characters
        //     .map(char => char.id).join('|');
        // data = await this.request('characters', {filter: 'id:' + charIds});
        // volume.characters = data.results
        //     .map(row => this.parseCharacter(row));

        data = await this.request('issues', {filter: 'volume:' + id});
        volume.issues = data.results
            .map(row => this.parseIssue(row))
            .sort((a, b) => Number(b.issueNumber) - Number(a.issueNumber)); //b.date ? b.date.localeCompare(a.date) : 0);

        for(let i = 0; i < volume.issues.length; i++) {
            const issue = volume.issues[i];
            volume.issues[i] = Object.assign(issue, await storage.getIssue(issue.id));
        }

        return volume;
    }

    async issue(id) {
        let data = await this.request('issue/' + issueId + '-' + id);
        const issue = this.parseIssue(data.results);

        // const charIds = data.results.character_credits
        //     .map(char => char.id).join('|');
        // data = await this.request('characters', {filter: 'id:' + charIds});
        // issue.characters = data.results
        //     .map(row => this.parseCharacter(row));

        data = await this.request('volume/' + volumeId + '-' + issue.volume.id);
        issue.volume = this.parseVolume(data.results);

        return issue;
    }

    // async character(id) {
    //     let data = await this.request('character/' + characterId + '-' + id);
    //     const character = this.parseCharacter(data.results);
    //
    //     return character;
    // }

    async search(query) {
        const response = await this.request('search', {query: query});
        let result = {};
        // result.characters = response.results
        //     .filter(row => row['resource_type'] === 'character')
        //     .map(row => this.parseCharacter(row));

        result.issues = response.results
            .filter(row => row['resource_type'] === 'issue')
            .map(row => this.parseIssue(row));

        result.volumes = response.results
            .filter(row => row['resource_type'] === 'volume')
            .map(row => this.parseVolume(row));
        return result;
    }

    async trackedVolumes() {
        let volumes = await storage.getTrackedVolumes();
        let ids = volumes.map(volume => volume.id);

        let data = await this.request('volumes', {filter: 'id:' + ids});
        volumes = data.results.map(row => this.parseVolume(row));
        return volumes;
    }

    parseIssue(data) {
        let volume = null;
        if (data.volume) {
            volume = {
                id: data.volume.id,
                name: data.volume.name
            }
        }

        return {
            id: data.id,
            name: data.volume.name,
            thumbnail: data.image ? data.image.thumb_url : null,
            detailsUrl: data.site_detail_url,
            description: this.stripHTML(data.description),
            resourceType: data.resource_type,
            issueNumber: data.issue_number,
            date: data.store_date,
            volume: volume
        };
    }

    parseVolume(data) {
        return {
            id: data.id,
            name: data.name,
            startYear: data.start_year,
            thumbnail: data.image ? data.image.thumb_url : null,
            detailsUrl: data.site_detail_url,
            description: this.stripHTML(data.description),
            resourceType: data.resource_type
        };
    }

    // parseCharacter(data) {
    //     return {
    //         id: data.id,
    //         name: data.name,
    //         thumbnail: data.image ? data.image.thumb_url : null,
    //         detailsUrl: data.site_detail_url,
    //         description: this.stripHTML(data.description),
    //         resourceType: data.resource_type
    //     }
    // }

    async request(resource, params) {
        const url = this.getUrl(resource, params);

        const cachedData = this.cache.get(url);
        if (cachedData) {
            return cachedData;
        }

        console.log('request', url);
        const response = await fetch(url);
        const data = response.json();
        this.cache.store(url, data);
        return data;
    }

    getUrl(resource, params) {
        params = params || {};
        params.api_key = apiKey;
        params.format = 'json';
        let url = baseUrl + resource + '?';
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                url += key + '=' + encodeURIComponent(params[key]) + '&';
            }
        }

        url = url.substring(0, url.length - 1);

        return url;
    }

    stripHTML(html) {
        try {
            if (html) {
                // return decodeURI(html.replace(/<[^>]*>/g, " "));
                return html.replace(/<[^>]*>/g, " ");
            } else {
                return html;
            }
        } catch (e) {
            console.error(e);
            console.log(html);
            return html;
        }
    }
}

module.exports = new comicVine();