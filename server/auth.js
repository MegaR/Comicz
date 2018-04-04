const finalDB = require('final-db');
const bcrypt = require('bcrypt');

class Auth {
    constructor() {
        this.tokens = new finalDB.Collection({dirName: 'data/tokens'});
        this.password = new finalDB.Collection({dirName: 'data/password'});
    }

    setup(app) {
        app.post('/login', (req, res) => this.login(req, res).catch(error => res.status(500).send(error)) );

        app.use((req, res, next) => {
            if (!this.validate(req.headers['authentication'])) {
                res.status(401).send('Unauthorized');
                return;
            }
            next();
        });

        app.post('/setPassword', (req, res) => this.setPassword(req.body.password)
            .then(data => res.send(data))
            .catch(error => res.status(500).send(error)));

        app.post('/logout', (req, res) => this.logout(req, res));
    }

    async validate(token) {
        try {
            await this.tokens.find(token);
            return true;
        } catch (error) {
            return false;
        }
    }

    async login(req, res) {
        try {
            const creds = await this.password.find('0');
            const result = await bcrypt.compare(req.body.password, creds.hash);
            if (!result) {
                res.status(401).send('Wrong password');
                return;
            }
        } catch(error) {
            if(error.message !== 'not_found') {
                throw error;
            }
            console.warn('no password set');
        }

        const token = this.generateToken();
        this.tokens.save({id: token});
        await this.tokens.flush();
        res.status(202).send(token);
    }

    logout(req, res) {
        Promise.resolve(this.tokens.find(req.headers['authentication']))
            .then(token => {
                this.tokens.remove(token);
                return this.tokens.flush();
            })
            .then(() => {
                res.send('logged out');
            })
            .catch(error => {
                console.error(error);
                res.status(500).send(error);
            });
    }

    async setPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        this.password.save({id: '0', hash: hash});
        await this.password.flush();
        return "password changed";
    }

    generateToken() {
        function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return guid();
    }
}

module.exports = new Auth();