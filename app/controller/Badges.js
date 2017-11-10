exports._ = () => class Badges{
    constructor(user){
        this.badges = user['badge_counts'];
    }
    get gold(){
        return this.badges.gold;
    }
    get silver(){
        return this.badges.silver;
    }
    get bronze(){
        return this.badges.bronze;
    }
};