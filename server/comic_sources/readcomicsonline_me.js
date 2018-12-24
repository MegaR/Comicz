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

        console.log(`${this.baseUrl}${volume}`);
        let data = await fetch(`${this.baseUrl}${volume}`);
        data = await data.text();

        //double escape seems necessary here :|
        let regex = new RegExp(`<li class="chapter"><a href="([\\d\\w:\\/\\.\\(\\)-]*_Issue_0*?${issue})">`,'g');
        let url = regex.exec(data);
        if(!url) {
            console.log('couldnt match issue ' + issue);
            return [];
        }
        url = url[1] + '/?q=fullchapter';
        console.log(url);
        data = await fetch(url);
        data = await data.text();
        regex = /<img (class="picture" )?src="(.*?)" \/><br \/>/g;
        let urls = [];
        let match;
        while ((match = regex.exec(data)) !== null) {
            urls.push(match[2]);
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