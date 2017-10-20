import servicesApi from '../services/stackexchange-service';
import db from '../data/dataStore';

const SideBar = class Sidebarcontroller{
  constructor(){
     this.profile;
  }
  async getMe(){
    let profile;
    await servicesApi.fetch('/me', { access_token: db.get("access_token") }).then(response => {
      profile = response.items[0];
      db.set({profile: profile});
    });
    return profile;
  };
  async render(){
    console.log(db.get("profile"))
    const profile = await this.getMe();
    return document.querySelector("#sidebar").insertAdjacentHTML('beforeend',`<div class = "sidebar">
      <figure>
        <img src="${profile.profile_image}" alt="" sizes="" srcset="">
      </figure>
    </div>`);
  }
}



export default SideBar;