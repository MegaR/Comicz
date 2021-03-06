const fetch = require('node-fetch');

class ReadcomicsWebsite {
    constructor() {
        this.baseUrl = "http://readcomicsonline.ru/";
    }

    get name() {
        return 'readcomicsonline.ru';
    }

    async search(volumeName) {
        let data = await fetch(this.baseUrl+'search?query='+volumeName);
        data = await data.json();
        data = data.suggestions.map(result => ({name: result.value, id: result.data}));
        return data;
    }

    fixIssuePart(issue) {
        return issue.replace('.', '-')
    }

    async page(volume, issue, page) {
        issue = this.fixIssuePart(issue);
        page += 1;
        if(page.toString().length < 2) {
            page = '0' + page.toString();
        }

        const data = await fetch(`${this.baseUrl}/uploads/manga/${volume}/chapters/${issue}/${page}.jpg`);
        return data.buffer();
    }

    async details(volume, issue) {
        issue = this.fixIssuePart(issue);
        let data = await fetch(`${this.baseUrl}/comic/${volume}/${issue}`);
        data = await data.text();
        data = data.match(/pages = (\[.*?\])/g)[0].match(/\[.*\]/g)[0];
        data = JSON.parse(data);
        return {totalPages: data.length};
    }
}

module.exports = new ReadcomicsWebsite();