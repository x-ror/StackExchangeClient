const RequestBuilder = require('../services/RequestBuilder')
const Question = require('./Question')
let has_more = false

class Search {
  constructor () {}

  static async findByTagName ({tag, page}) {
    const questions = []
    await RequestBuilder.fetch('/search/advanced', {
      page: page,
      tagged: tag,
      pagesize: 20,
      order: 'desc',
      sort: 'activity'
    }).then(res => {
      has_more = res['has_more']
      res.items.map(item => {
        questions.push(new Question(item))
      })
    })
    return {questions, has_more}
  }
}

module.exports = Search