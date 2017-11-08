exports._ = () => class Badges{
    constructor(user){
        this.badges = user.badge_counts;
    }
    async gold(){
        return await this.badges.gold;
    }
    async silver(){
        return await this.badges.silver;
    }
    async bronze(){
        return await this.badges.bronze;
    }
};