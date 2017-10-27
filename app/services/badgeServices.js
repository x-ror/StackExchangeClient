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
    let _ = []
    for (let [k, badge] of Object.entries(this.badges)) {
      _.push(`<span class="${k}">${k}:${badge} </span>`);
    }
    return _.join('');
  }
}; 
export default Badge;