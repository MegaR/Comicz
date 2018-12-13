const fetch = require('node-fetch');

class ReadComicsOnlineMe {
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

    fixIssuePart(issue) {
        if(!issue.includes('.')) {
            return issue;
        }
        const alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        let split = issue.split('.');
        split[1] = alphabet[Number(split[1])];
        return split[0]+split[1];
    }

    async urls(volume, issue) {
        issue = this.fixIssuePart(issue);

        let data = await fetch(`${this.baseUrl}${volume}`);
        data = await data.text();
        let regex = new RegExp(`<li class="chapter"><a href="([\\d\\w:\\/\\.\\(\\)]*_Issue_0*?${issue})">`,'g');
        const url = regex.exec(data)[1] + '/?q=fullchapter';
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
        const url = `${this.baseUrl}reader/${urls[page]}`;
        console.log(url);
        const data = await fetch(url, {
            headers: { 'referer': this.baseUrl }
        });
        return await data.buffer();
    }

    async details(volume, issue) {
        const urls = await this.urls(volume, issue);
        return {totalPages: Number(urls.length)};
    }
}

module.exports = new ReadComicsOnlineMe();