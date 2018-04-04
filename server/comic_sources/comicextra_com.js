const fetch = require('node-fetch');

class ComicExtraCom {
    constructor() {
        this.baseUrl = "http://comicextra.com/";
    }

    get name() {
        return 'ComicExtra.com';
    }

    async search(issue) {
        const query = [issue.volume.name].join(' ');
        let data = await fetch(this.baseUrl+'comic-search?key='+query);
        data = await data.text();
        data = data.match(/<div class="cartoon-box">[\s\S]*?<\/div>/g);

        data = data.map(item => ({
            name: /<h3>.*>(.*)<\/a><\/h3>/gi.exec(item)[1],
            id: /<a href="(.*?)" class="image">/g.exec(item)[1].replace('http://www.comicextra.com/comic/', '')
        }));
        return data;
    }

    async page(volume, issue, page) {
        page += 1;
        let data = await fetch(this.baseUrl + `${volume}/chapter-${issue}/${page}`);
        data = await data.text();
        const url = /<img id="main_img" .*?src="(.*?)"/g.exec(data)[1];
        data = await fetch(url);
        return await data.buffer();
    }

    async details(volume, issue) {
        let data = await fetch(`${this.baseUrl}/${volume}/chapter-${issue}`);
        data = await data.text();
        data = /<div class="label1">of (.*?)<\/div>/g.exec(data)[1];
        return {totalPages: Number(data)};
    }
}

module.exports = new ComicExtraCom();