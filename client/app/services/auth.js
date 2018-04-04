import api from './api';

class Auth {

    constructor() {
        this.authenticated = false;
    }

    isAuthenticated() {
        return !!localStorage.token;
    }

    setCallback(callback) {
        this.callback = callback;
    }

    async login(password) {
        localStorage.token = await api.login(password);
        this.authenticated = true;
        this.callback(true);
    }

    logout() {
        api.logout(); //todo handle promise
        localStorage.removeItem('token');
        this.callback(false);
    }
}

const auth = new Auth();
export default auth;