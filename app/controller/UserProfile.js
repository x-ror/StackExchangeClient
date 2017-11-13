
const RequestServices = require('../services/RequestServices').request();
const Privileges = require('./Privileges').init();
const Badges = require('./Badges')._();

let id = 0;

exports._ = () => class UserProfile{
    constructor(){
        this.profile = {};
    }
    async render(){
        this.id = id+=1;
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
    showModal(){
        return `
        <div class="modal fade" id="userProfileInformation${this.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">${this.profile['display_name']}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    </div>
                </div>
            </div>
        </div>`;
    }
};

const getMe = async () => {
    return await RequestServices.fetch('/me', { access_token: localStorage.token }).then( response => {
        return response.items[0];
    });
};