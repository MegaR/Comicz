const fetch = require('node-fetch');

class ComicExtraCom {
    constructor() {
        this.baseUrl = "https://readcomicsonline.me/";
    }

    get name() {
        return 'ReadComicsOnline.me';
    }

    async search(volumeName) {
        let data = await fetch(this.baseUrl+'search/node/'+volumeName);
        data = await data.text();
        const regex = /<a href="https:\/\/readcomicsonline\.me\/(.*)">(.*)<\/a>/g;
        let result = [];
        let match;
        while ((match = regex.exec(data)) !== null) {
            result.push({id: match[1], name: match[2]});
        }

        return result;
    }

    async urls(volume, issue) {
        let data = await fetch(`${this.baseUrl}${volume}`);
        data = await data.text();
        let regex = /<li class="chapter"><a href="[a-zA-Z_:\/.0-9]*\/([a-zA-Z_0-9]*)\/.*?">/g;
        volume = regex.exec(data)[1];

        volume = volume.replace('-','_');
        if(issue.length < 2) issue = '0' + issue;
        const url = `${this.baseUrl}reader/${volume}/${volume}_Issue_${issue}/?q=fullchapter`;
        data = await fetch(url);
        data = await data.text();
        regex = /<img src="(.*?)" \/><br \/>/g;
        let urls = [];
        let match;
        while ((match = regex.exec(data)) !== null) {
            urls.push(match[1]);
        }
        return urls;
    }

    async page(volume, issue, page) {
        const urls = await this.urls(volume, issue);
        const data = await fetch(`${this.baseUrl}reader/${urls[page]}`);
        return await data.buffer();
    }

    async details(volume, issue) {
        const urls = await this.urls(volume, issue);
        return {totalPages: Number(urls.length)};
    }
}

module.exports = new ComicExtraCom();