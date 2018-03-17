const finalDB = require('final-db');

class Storage {
    constructor() {
        this.volumes = new finalDB.Collection({dirName: 'data/volumes'});
        this.issues = new finalDB.Collection({dirName: 'data/issues'});
    }

    setup(app) {
        app.post('/api/storage/markFinished/:issueId', (req, res) => {
            this.setFinished(Number(req.params.issueId), req.body.state)
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });

        app.post('/api/storage/markTracked/:volumeId', (req, res) => {
            this.setVolumeTracked(Number(req.params.volumeId), req.body.state)
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json(error);
                });
        });

        app.post('/api/storage/setProgress/:issueId/:progress', (req, res) => {
            this.setProgress(Number(req.params.issueId), Number(req.params.progress))
                .then(data =>{
                    res.json(data);
                }).catch(error => {
                    console.error(error);
                    res.status(500).json(error);
            });
        });
    }

    async getVolume(id) {
        try {
            return await this.volumes.find(id);
        } catch (error) {
            if (error.message === 'not_found') {
                return {id: id, tracked: false}
            } else {
                throw error;
            }
        }
    }

    async getIssue(id) {
        try {
            return await this.issues.find(id);
        } catch (error) {
            if (error.message === 'not_found') {
                return {id: id, progress: 0, finished: false};
            } else {
                throw error;
            }
        }
    }

    async setVolumeTracked(id, state) {
        let volume = await this.getVolume(id);
        volume.tracked = state;
        await this.saveVolume(volume);
        return volume.tracked;
    }

    async saveVolume(volume) {
        this.volumes.save(volume);
        await this.volumes.flush();
    }

    async saveIssue(issue) {
        this.issues.save(issue);
        await this.issues.flush();
    }

    async setProgress(issueId, progress) {
        const issue = await this.getIssue(issueId);
        issue.progress = progress;
        await this.saveIssue(issue);
    }

    async getProgress(issueId) {
        const issue = await this.getIssue(issueId);
        return issue ? issue.progress : 0;
    }

    async setFinished(issueId, state) {
        const issue = await this.getIssue(issueId);
        issue.finished = state;
        await this.saveIssue(issue);
        return state;
    }

    async getTrackedVolumes() {
        const volumes = await this.volumes.find();
        return volumes.filter(vol => vol.tracked);
    }
}

module.exports = new Storage();