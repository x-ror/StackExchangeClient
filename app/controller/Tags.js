class Tags {
  constructor (question) {
    this.question = question
    this.tags = question.tags || ''
  }

  get maping () {
    return this.tags.map(item => {
      return `<div class="u-tags-v1 g-font-size-13 g-color-main g-brd-around g-bg-gray-light-v5 g-bg-primary--hover g-color-white--hover rounded-0 g-py-5 g-px-15">${item}</div> `
    }).join('')

  }
}

module.exports = Tags