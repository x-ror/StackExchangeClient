class Votes {
  constructor (post) {
    this.post = post
  }

  get count () {
    return this.post['score']
  }
}

module.exports = Votes