class API {
    request(requestInfo, requestInit) {
        requestInit = requestInit || {};
        requestInit.credentials = 'same-origin';
        let headers = requestInit.headers || {};
        headers['Authentication'] = localStorage.token;
        headers['content-type'] = 'application/json';
        requestInit.headers = new Headers(headers);

        return fetch(requestInfo, requestInit).then(data => {
            if (data.status >= 400) throw new Error('http ' + data.status, data.text());
            return data;
        });
    }

    async search(query) {
        return (await this.request('/api/comicvine/search/' + query)).json();
    }

    async volume(id) {
        return (await this.request('/api/comicvine/volume/' + id)).json();
    }

    async issue(id) {
        return (await this.request('/api/comicvine/issue/' + id)).json();
    }

    async character(id) {
        return (await this.request('/api/comicvine/character/' + id)).json();
    }

    async searchComic(issue) {
        return (await this.request('/api/search', {
            method: 'POST',
            body: JSON.stringify(issue)
        })).json();
    }

    async page(issueId, source, volume, issue, page) {
        let data = await this.request(`/api/page/${issueId}/${source}/${volume}/${issue}/${page}`);
        data = await data.blob();
        const image = new Image();
        image.src = URL.createObjectURL(data);
        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
        });
        return image;
    }

    async issueDetails(issueId, source, volume, issue) {
        return (await this.request(`/api/issueDetails/${issueId}/${source}/${volume}/${issue}`)).json();
    }

    async markFinished(issueId, state) {
        return (await this.request(`/api/storage/markFinished/${issueId}`, {
            method: 'POST',
            body: JSON.stringify({state: state})
        })).json();
    }

    async markTracked(volumeId, state) {
        return (await this.request(`/api/storage/markTracked/${volumeId}`, {
            method: 'POST',
            body: JSON.stringify({state: state})
        })).json();
    }

    async setProgress(issueId, progress) {
        return (await this.request(`/api/storage/setProgress/${issueId}/${progress}/`, {
            method: 'POST'
        })).json();

    }

    async getTrackedVolumes() {
        return (await this.request(`/api/comicvine/trackedVolumes`)).json();
    }

    async login(password) {
        return (await this.request(`/api/login`, {
            method: 'POST',
            body: JSON.stringify({password: password})
        })).text();
    }

    async logout() {
        return (await this.request(`/api/logout`, {
            method: 'POST'
        })).text();
    }

    async setPassword(password) {
        return (await this.request(`/api/setPassword`, {
            method: 'POST',
            body: JSON.stringify({password: password})
        })).text();
    }
}

export default new API();