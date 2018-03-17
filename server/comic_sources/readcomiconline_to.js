const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const Cache = require('../cache.js');

class ReadComicOnlineTo {
    constructor() {
        this.baseUrl = "http://readcomiconline.to/";
        this.cache = new Cache();
        this.browser = null;
        this.browserTimeout = null;
    }

    get name() {
        return 'readcomiconline.to';
    }

    async getPage(url) {
        if(this.browser) {
            clearTimeout(this.browserTimeout);
        } else {
            this.browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true
            });
            this.browserTimeout = setTimeout(()=>{this.browser.close(); this.browser = null}, 1000*60);
        }

        const page = await this.browser.newPage();
        await page.goto(url);
        const currentContent = await page.content();
        if(currentContent.indexOf("Checking your browser before accessing") >= 0) {
            console.log('readcomiconline: waiting for verification');
            await this.sleep(6000);
            // await page.waitForNavigation({waitUntil: ['domcontentloaded']});
            // await page.waitForFunction(() => document.body && document.body.innerHTML.indexOf("Checking your browser before accessing") === -1);
            // try {
            //     await page.waitForNavigation();
            // } catch(error) {
            //     console.error(error);
            // }
        }
        console.log('readcomiconline: finished verification. Reloading page');
        await page.goto(url, {waitUntil:['domcontentloaded']});
        return page;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async search(issue) {
        let result = this.cache.get(`search/${issue.volume.name}`);
        if(!result) {
            const page = await this.getPage(this.baseUrl);

            const query = issue.volume.name;
            await page.evaluate(async (query) => {
                const form = document.createElement('form');
                form.action = '/Search/SearchSuggest';
                form.method = 'POST';
                const input1 = document.createElement('input');
                input1.type = 'hidden';
                input1.name = 'type';
                input1.value = 'Comic';
                const input2 = document.createElement('input');
                input2.type = 'hidden';
                input2.name = 'keyword';
                input2.value = '"'+query+'"';
                form.appendChild(input1);
                form.appendChild(input2);
                document.body.appendChild(form);
                form.submit();
            }, query);
            console.log('readcomiconline: waiting for form redirect');
            await page.waitForNavigation();
            const data = await page.content();
            // await browser.close();

            const regex = /<a href="(.*?)">(.*?)<\/a>/g;
            result = [];
            let match;
            while ((match = regex.exec(data)) !== null) {
                let id = match[1];
                id = id.split('/');
                result.push({id: id[id.length - 1], name: match[2]});
            }

            await page.close();
            this.cache.store(`search/${issue.volume.name}`, result);
        }

        return result;
    }

    async urls(volume, issue) {
        let urls = this.cache.get(`${volume}/${issue}`);
        if(!urls) {
            const browserPage = await this.getPage(this.baseUrl + `Comic/${volume}/Issue-${issue}`);
            const data = await browserPage.content();

            const regex = /lstImages\.push\("(.*?)"\)/g;
            urls = [];
            let match;
            while ((match = regex.exec(data)) !== null) {
                urls.push(match[1]);
            }
            this.cache.store(`${volume}/${issue}`, urls);
        }

        return urls;
    }

    async page(volume, issue, page) {
        let urls = await this.urls(volume, issue);
        if(page > urls.length - 1) page = urls.length - 1;
        const issuePage = await fetch(urls[page]);
        return issuePage.buffer();
    }

    async details(volume, issue) {
        let urls = await this.urls(volume, issue);
        return {totalPages: urls.length};
    }
}

module.exports = new ReadComicOnlineTo();