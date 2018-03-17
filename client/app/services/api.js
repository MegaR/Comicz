class API {
    async search(query) {
        return (await fetch('/api/comicvine/search/' + query, {credentials: 'same-origin'})).json();
    }

    async volume(id) {
        return (await fetch('/api/comicvine/volume/' + id, {credentials: 'same-origin'})).json();
    }

    async issue(id) {
        return (await fetch('/api/comicvine/issue/' + id, {credentials: 'same-origin'})).json();
    }

    async character(id) {
        return (await fetch('/api/comicvine/character/' + id, {credentials: 'same-origin'})).json();
    }

    async searchComic(issue) {
        return (await fetch('/api/search', {
            method: 'POST',
            body: JSON.stringify(issue),
            headers: new Headers({'content-type': 'application/json'}),
            credentials: 'same-origin'
        })).json();
    }

    async page(issueId, source, volume, issue, page) {
        let data = await fetch(`/api/page/${issueId}/${source}/${volume}/${issue}/${page}`, {credentials: 'same-origin'});
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
        return (await fetch(`/api/issueDetails/${issueId}/${source}/${volume}/${issue}`, {credentials: 'same-origin'})).json();
    }

    async markFinished(issueId, state) {
        return (await fetch(`/api/markFinished/${issueId}`, {
            method: 'POST',
            body: JSON.stringify({state: state}),
            headers: new Headers({'content-type': 'application/json'}),
            credentials: 'same-origin'
        })).json();
    }

    async markTracked(volumeId, state) {
        return (await fetch(`/api/markTracked/${volumeId}`, {
            method: 'POST',
            body: JSON.stringify({state: state}),
            headers: new Headers({'content-type': 'application/json'}),
            credentials: 'same-origin'
        })).json();
    }

    async getTrackedVolumes() {
        return (await fetch(`/api/comicvine/trackedVolumes`, {credentials: 'same-origin'})).json();
    }
}

export default new API();