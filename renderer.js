'use strict'
const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

const TemplatesLoader = require('./app/templates/template-loader')
const RequestBuilder = require('./app/services/RequestBuilder')
const UserProfile = require('./app/controller/UserProfile')
const Question = require('./app/controller/Question')
const Observer = require('./app/observer/observer')
const Sugar = require('sugar')()

const win = remote.getCurrentWindow()

ipc.on('sidebar:initialize', async () => {
  const userProfile = new UserProfile()
  await userProfile.render()
  await TemplatesLoader.loadHeader(userProfile)

  Observer.subscribe('script_loaded', {}, async (data) => {
    const questions = await Question.getQuestions()
    questions.map(async question => {
      await question.render()
    })
  })
})

ipc.on('stackexchange:login', (event, data) => {
  localStorage.token = data.token
  Object.freeze(localStorage.token)
  win.webContents.send('sidebar:initialize')
})

$(() => {
  $(document).on('click', '.question', function (e) {
    var id = $(this).attr('data-id') // or var clickedBtnID = this.id
    var tags = this.querySelector('.tags').innerText
    var date = this.querySelector('.date').innerText
    var votes = this.querySelector('.vote').innerText
    var owner = this.querySelector('.author').innerText
    var views = this.querySelector('.viewcount').innerText
    var title = this.querySelector('.question__link').innerText
    var answersCount = this.querySelector('.answers').innerText

    // alert(e.target.className);
    if (e.target.className === 'question__link') {
      console.log('click')
      const question = new Question(id, title, views, tags, votes, answersCount, date, owner)
      var currentquestion = await
      question.getQuestionById()
      const answers = await
      Answer.getAnswers(currentquestion)
      question.showQuestion()
      if (answers)
        for (var i = 0; i < answers.length; i++)
          answers[i].showAnswer();

    }
  })
  $(document).on('click', '.add_post_link', async function (e) {
    const question = new Question(null, 'new post', 0, ['first', 'second', 'third'], 0, 0, null, null)
    question.body = 'text text text text text'
    //question.Create();
    $.post(`https://api.stackexchange.com/2.2/questions/add`, {
      'access_token': localStorage.token,
      'title': this.title,
      'body': this.body,
      'tags': this.tags
    }, function (serverResponse) {

      //do what you want with server response

    })
  })
})