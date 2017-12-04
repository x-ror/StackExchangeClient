const RequestBuilder = require('../services/RequestBuilder')

class Answers {
  constructor (post) {
    this.post = post
  }

  get count () {
    return this.post['answer_count'] || 0
  }

  static async getAnswers (post) {
    let answers = []
    if (post.answers > 0) {
      await RequestBuilder.fetch(`/questions/${post.id}/answers`, {order: 'desc', sort: 'activity', filter: 'withbody'})
        .then(res => {
          for (let i = 0; i < res.items.length; i++) {
            const answer = new Answers(post)
            answer.id = res.items[i]['answer_id']

            answer.body = res.items[i]['body']
            answer.date = new Date(res.items[i]['creation_date']).relative('ru')

            answer.owner = res.items[i]['owner']
            answer.score = res.items[i]['score']
            answers.push(answer)
          }
        })
      return answers
    }
    return null
  }

  showAnswer () {
    const showQuestion = `<div class="answers" data-id="${this.id}">
          
          <div class="answer__body">
           ${this.body}
          </div>
          
          <div class="score">
           ${this.score}
          </div>
          <div class="author">${this.owner.display_name}</div>
          <div class="date">
           ${this.date}
          </div>
        </div>`
    document.querySelector('.container').insertAdjacentHTML('beforeend', showQuestion)
  }
}

module.exports = Answers