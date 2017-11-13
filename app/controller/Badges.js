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
    spanMap(){
        let stack = [];
        for (let key in this.badges)
            if(this.badges.hasOwnProperty(key))
                this.badges[key] > 0 ? stack.push(`<span class="badge badge-${key}">●${this.badges[key]}</span>`): '';
        return stack.join('');
    }
};