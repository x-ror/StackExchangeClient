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
  <div class="row ">
    <div class="col-lg-12 g-mb-30">
      <article class="g-brd-around g-brd-gray-light-v4 rounded">
        <div class="g-pa-30">
          <h3 class="g-font-weight-300 g-mb-15">
            <a class="u-link-v5 g-color-main g-color-primary--hover question question__link" data-href="/question" data-id="${this.id}" rel="nofollow">
            ${this.Title.trim()}
            </a>
          </h3>
          <p>tag</p>
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
    console.log(this)
    await TemplateLoader.renderQuestion(this)
    // const content = document.querySelector('.content')
    //
    // while (content.firstChild) {
    //   content.removeChild(content.firstChild)
    // }
    // content.insertAdjacentHTML('afterbegin', `
    //   .question
    // `)
  }

}

module.exports = Question