const Badges = require('./Badges')._();
const Privileges = require('./Privileges')._();
// const electron = require('electron');
// const remote = electron.remote;
const RequestServices = require('../services/RequestServices').request();
const user1 = require('./UserController');
exports._ = () => class UserProfile{
    constructor(){}
    async render(){
        const user = await getMe();
        document.querySelector(".container").insertAdjacentHTML('beforeend',
            '<button type="button" id="logOut" class="btn btn-lg">Log Out</button>');
        document.querySelector('#logOut').addEventListener('click', () => {
            user1.logout({ access_token: localStorage.token });

        });
        this.badges = new Badges(user);
        this.privileges = new Privileges(user);
    }
    async getBadges(){
        return await new Badges(user);
    }
    async getPrivileges() {
        return await new Privileges(user);
    }
};

const getMe = async () => {
    return await RequestServices.fetch('/me', { access_token: localStorage.token }).then( response => {
        return response.items[0];
    });
};