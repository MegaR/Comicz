const fetch = require('node-fetch');

class ReadcomicsWebsite {
    constructor() {
        this.baseUrl = "http://readcomics.website/";
    }

    get name() {
        return 'readcomics.website';
    }

    async search(issue) {
        const query = [issue.volume.name].join(' ');
        let data = await fetch(this.baseUrl+'search?query='+query);
        data = await data.json();
        data = data.suggestions.map(result => ({name: result.value, id: result.data}));
        return data;
    }

    async page(volume, issue, page) {
        page += 1;
        if(page.toString().length < 2) {
            page = '0' + page.toString();
        }

        const data = await fetch(`${this.baseUrl}/uploads/manga/${volume}/chapters/${issue}/${page}.jpg`);
        return data.buffer();
    }

    async details(volume, issue) {
        let data = await fetch(`${this.baseUrl}/comic/${volume}/${issue}`);
        data = await data.text();
        data = data.match(/pages = (\[.*?\])/g)[0].match(/\[.*\]/g)[0];
        data = JSON.parse(data);
        return {totalPages: data.length};
    }
}

module.exports = new ReadcomicsWebsite();