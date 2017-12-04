const Tags = require('./Tags')
const Votes = require('./Votes')
const uniqid = require('uniqid')
const Answers = require('./Answers')
const Owner = require('./UserProfile')
const RequestBuilder = require('../services/RequestBuilder')

class Question {
  constructor (data = {}) {

    this.id = data['question_id']
    this.tags = new Tags(data)

    this.link = data['link'].unescapeURL()

    this.title = data.title || ''
    this.owner = new Owner(data.owner)
    this.views = data['view_count'] || 0

    this.votes = (new Votes(data)).count
    this.answers = (new Answers(data)).count

    this.date = new Date.create(data['creation_date'] * 1000).relative('ru')
  }

  static async getQuestions () {
    const questions = []

    await RequestBuilder.fetch('/questions', {pagesize: 20, order: 'desc', sort: 'activity'}).then(res => {
      res.items.map(item => {
        questions.push(new Question(item))
      })
    })
    return questions
  }

  async getQuestionById () {
    let body = []
    await RequestBuilder.fetch(`/questions/${this.id}`, {filter: 'withbody'}).then(response => {
      this.body = (response.items[0].body)
    })
    return this
  }

  render () {
    const showQuestion = `
<div class="row">
  <div class="col-lg-12 g-mb-30">
    <article class="g-brd-around g-brd-gray-light-v4 rounded">
      <div class="g-pa-30">
        <h3 class="g-font-weight-300 g-mb-15">
          <a class="u-link-v5 g-color-main g-color-primary--hover" class="question question__link" data-id="${this.id}" rel="nofollow">
          ${this.title.titleize()}
          </a>
        </h3>
        <p>tag</p>
      </div>

      <div class="media g-font-size-12 g-brd-top g-brd-gray-light-v4 g-pa-15-30">
        <img class="d-flex g-width-20 g-height-20 rounded-circle g-mr-10" src="${this.owner.UserPicture}" alt="${this.owner.UserName}">
        <div class="media-body align-self-center">
          <a class="u-link-v5 g-color-main g-color-primary--hover" href="#">${this.owner.UserName}</a>
        </div>

        <div class="align-self-center">
          <a class="u-link-v5 g-color-main g-color-primary--hover g-mr-10" href="#">
            <i class="icon-bubbles align-middle g-mr-3"></i>
            ${this.answers}
          </a>
          <a class="u-link-v5 g-color-main g-color-primary--hover" href="#">
            <i class="icon-eye align-middle g-mr-3"></i>
            ${this.views}
          </a>
        </div>
      </div>
    </article>
  </div>`
    document.querySelector('.body').insertAdjacentHTML('beforeend', showQuestion)
  }

// <div class="viewcount">${this.views}</div>
//   <div class="vote">${this.votes}</div>
//   <div class="answers">${this.answers}</div>
//   <div class="date">${this.date}</div>
//   <div class="author">${this.owner.display_name}</div>
// </div>
  showQuestion () {
    var showQuestion = `<div class="question" data-id="${this.id}">
          <div class="title">
            <h4><a href="#" class="question__link">${this.title}</a></h4>
          </div>
          <div class="question__body">
           ${this.body}
          </div>
          <div class="tags">
           
          </div>
          <div class="viewcount">
           ${this.views}
          </div>
          <div class="vote">
           ${this.votes}
          </div>
          <div class="author">${this.owner}</div>
          <div class="date">
           ${this.date}
          </div>
          <div class="answers">
           ${this.answers}
          </div>
        </div>`
    document.querySelector('.container').innerHTML = ''
    document.querySelector('.container').insertAdjacentHTML('beforeend', showQuestion)
  }
}

module.exports = Question