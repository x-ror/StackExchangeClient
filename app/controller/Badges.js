class Badges {
  constructor (badges) {
    this.badges = badges || {}
  }

  get gold () {
    return this.badges.gold || 0
  }

  get silver () {
    return this.badges.silver || 0
  }

  get bronze () {
    return this.badges.bronze || 0
  }

  mapping () {
    let stack = []
    for (let key in this.badges)
      if (this.badges.hasOwnProperty(key))
        this.badges[key] > 0 ? stack.push(`<span class="badge badge-${key}">●${this.badges[key]}</span>`) : ''
    return stack.join('')
  }
}

module.exports = Badges