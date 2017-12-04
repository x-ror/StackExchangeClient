class Tags {
  constructor (question) {
    this.question = question
    this.tags = question.tags || ''
  }

  // get Tags () {
  //   let tags = []
  //   for (let i = 0; i < this.question.tags.length; i++) {
  //     tags.push(this.question.tags[i])
  //   }
  //
  //   return tags
  // }
}

module.exports = Tags