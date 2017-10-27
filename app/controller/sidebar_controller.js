import servicesApi from '../services/stackexchange-service';
import db from '../data/dataStore';
import Badge from '../services/badgeServices';
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
    const badge = new Badge(profile);
    
    await servicesApi.fetch('/me/favorites', { order: "desc",sort:"activity",access_token: db.get("access_token")}).then(response => {
      console.log(response);
    });
    return document.querySelector("#sidebar").insertAdjacentHTML('beforeend',`<div class = "sidebar">
    <h5>${profile.display_name}</h5> 
      <div class="">
        <div class="badges">${badge.to_div()}</div>
      </div>
      <div class="">
        <a href="${profile.link}">
          <figure>
            <img src="${profile.profile_image}" alt="" sizes="" srcset="">
          </figure>
        </a>
      </div> 
    </div>`);
  }
}



export default SideBar;