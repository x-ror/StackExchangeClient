
const RequestServices = require('../services/RequestServices').request();
const Privileges = require('./Privileges').init();
const Badges = require('./Badges')._();

exports._ = () => class UserProfile{
    constructor(){
        this.profile = {};
    }
    async render(){
        this.profile    = await getMe();
        this.badges     = new Badges(this.profile);
        this.reputation = new Privileges(this.profile);
    }
    async getBadges(){
        return await new Badges(this.profile);
    }
    async getPrivileges() {
        return await new Privileges(this.profile);
    }
};

const getMe = async () => {
    return await RequestServices.fetch('/me', { access_token: localStorage.token }).then( response => {
        return response.items[0];
    });
};