const Tags = require('./Tags')
const Votes = require('./Votes')
const uniqid = require('uniqid')
const Answers = require('./Answers')
const ICRUD = require('./ICRUD')
const Owner = require('./UserProfile')
const RequestBuilder = require('../services/RequestBuilder')
const TemplateLoader = require('../templates/template-loader')

class Question extends ICRUD {
  constructor (data = {}) {
    super()
    this.id = data['question_id']
    this.Tags = new Tags(data)
    this.is_answered = data['is_answered']
    this.body = data['body'] || data['body_markdown'] || null
    this.link = data['link'].unescapeURL()

    this.Title = data.title.unescapeHTML()
    this.Owner = new Owner(data.owner)
    this.Views = data['view_count'] || 0

    this.Votes = (new Votes(data)).count
    this.Answers = (new Answers(data)).count

    this.date = new Date.create(data['creation_date'] * 1000).relative('ru')
    this.updated = new Date.create(data['last_activity_date'] * 1000).relative('ru')
  }

  static async getById (id) {
    const _id = id.toNumber()
    return await RequestBuilder.fetch(`/questions/${_id}`, {filter: '!9YdnSIaCy'}).then(question => {
      return new Question(question.items[0])
    })
  }

  static async getQuestions (page = 1) {
    const questions = []

    await RequestBuilder.fetch('/questions', {page: page, pagesize: 20, order: 'desc', sort: 'activity'}).then(res => {
      res.items.map(item => {
        questions.push(new Question(item))
      })
    })
    return questions
  }

  static async myQuestions () {
    let _res = [];
    await RequestBuilder.fetch(`/me/questions`, {
      access_token: localStorage.token,
      sort: 'activity',
      order: 'desc',
      pagesize: 20
    }).then(questions => {
      questions.items.map(item => {
        _res.push(new Question(item))
      })
    })
    return _res
  }

  static async myFavorites () {
    let _res = []
    await RequestBuilder.fetch(`/me/favorites`, {
      access_token: localStorage.token,
      sort: 'activity',
      order: 'desc',
      pagesize: 20
    }).then(questions => {
      questions.items.map(item => {
        _res.push(new Question(item))
      })
    })
    return _res
  }

  static eachRender (questions) {
    questions.map(question => {
      question.render()
    })
  }

  async Create () {
    await $.post(`https://api.stackexchange.com/2.2/questions/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        access_token: localStorage.token,
        title: this.title,
        body: this.body,
        tags: this.tags
      }
    }).then(response => {
      return true
    })
  }

  async Delete () {
    await RequestBuilder.fetch(`/questions/${this.id}/delete`, {id: this.id}).then(response => {
      return true
    })
  }

  async Edit (question) {
    await RequestBuilder.fetch(`/questions/${this.id}/edit`, {
      id: this.id,
      title: question.Title,
      body: question.body,
      tags: question.Tags.tags
    }).then(response => {
      return true
    })
  }

  render () {
    const showQuestion = `
  <div class="row g-mb-10">
    <div class="col-lg-12">
      <article class="g-brd-around g-brd-gray-light-v4 g-bg-white  rounded-0 ">
        <div class="g-pa-10">
          <h3 class="g-font-weight-300 g-ma-0 ">
            <a class="u-link-v5 g-color-main g-color-primary--hover g-cursor-pointer question question__link" data-href="/question" data-id="${this.id}" rel="nofollow">
            ${this.Title.trim()}
            </a>
          </h3>
        </div>
        <hr class="g-brd-gray-light-v4">
        <div class="row g-pa-10 g-pt-0">
					<div class="col-md-12">
						<div class="tags">
						${this.Tags.maping}
            </div>
					</div>
				</div>
        <div class="media g-font-size-12 g-brd-top g-brd-gray-light-v4 g-pa-15-30">
          <img class="d-flex g-width-20 g-height-20 rounded-circle g-mr-10" src="${this.Owner.UserPicture}" alt="${this.Owner.UserName}">
          <div class="media-body align-self-center">
            <a class="u-link-v5 g-color-main g-color-primary--hover" href="#">${this.Owner.UserName}</a>
          </div>
    
          <div class="align-self-center">
            <a class="u-link-v5 g-color-main g-color-primary--hover g-mr-10" href="#">
              <i class="icon-bubbles align-middle g-mr-3"></i>
              ${this.Answers}
            </a>
            <a class="u-link-v5 g-color-main g-color-primary--hover" href="#">
              <i class="icon-eye align-middle g-mr-3"></i>
              ${this.Views}
            </a>
          </div>
        </div>
      </article>
    </div>
  </div>`
    document.querySelector('.content').insertAdjacentHTML('beforeend', showQuestion)
  }

  async showQuestion () {
    await TemplateLoader.renderQuestion(this)
  }
}

module.exports = Question