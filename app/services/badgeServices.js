const Badge = class Badges {
  constructor(profile){
    this.badges = profile.badge_counts;
  }
  get allBadges(){
    this.badges
  }
  get gold(){
    this.badges.gold;
  }
  get silver(){
    this.badges.silver;
  }
  get silver(){
    this.badges.bronze;
  }
  to_div(){
    for (let [k, v] of Object.entries(this.badges)) {
      console.log(v);
      // localStorage.setItem(k, JSON.stringify(v));
    }
    // return this.badges.each( badge => {
    //   return `<div class="${badge}">${badge}<div>`;
    // }).join('');
  }
}; 
export default Badge;