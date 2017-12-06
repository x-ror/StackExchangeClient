class Tags {
  constructor (question) {
    this.question = question
    this.tags = question.tags || ''
  }

  get maping () {
    return this.tags.map(item => {
      return `<a rel="nofollow" class="u-tags-v1 g-font-size-13 g-color-main g-brd-around g-bg-gray-light-v5 g-bg-primary--hover g-color-white--hover rounded-0 g-py-5 g-px-15 g-mr-10" data-href='/tag?${item}'>${item}</a>`
    }).join('')

  }
}

module.exports = Tags