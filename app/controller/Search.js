const RequestBuilder = require('../services/RequestBuilder')
const Question = require('./Question')

class Search {
  constructor () {}

  static async findByTagName (tag_name, page = 1) {
    const questions = []
    await RequestBuilder.fetch('/search/advanced', {
      page: page,
      tagged: tag_name,
      pagesize: 20,
      order: 'desc',
      sort: 'activity'
    }).then(res => {
      res.items.map(item => {
        questions.push(new Question(item))
      })
    })
    return questions
  }
}

module.exports = Search