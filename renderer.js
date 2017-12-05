'use strict'
const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

const TemplatesLoader = require('./app/templates/template-loader')
const RequestBuilder = require('./app/services/RequestBuilder')
const UserProfile = require('./app/controller/UserProfile')
const Question = require('./app/controller/Question')
const Answers = require('./app/controller/Answers')
const Observer = require('./app/observer/observer')
const Sugar = require('sugar')()

const win = remote.getCurrentWindow()

Observer.subscribe('script_loaded', {}, async (data) => {
  document.querySelector('a[data-href="/home"').addEventListener('click', async (e) => {
    const link_content = document.querySelector('.content')
    while (link_content.firstChild) {
      link_content.removeChild(link_content.firstChild)
    }
    const questions = await Question.getQuestions()
    questions.map(async question => {
      await question.render()
    })
  })
})

ipc.on('sidebar:initialize', async () => {
  const userProfile = new UserProfile()
  await userProfile.render()
  await TemplatesLoader.loadHeader(userProfile)

  Observer.subscribe('script_loaded', {}, async (data) => {
    const link_content = document.querySelector('.content')
    while (link_content.firstChild) {
      link_content.removeChild(link_content.firstChild)
    }
    const questions = await Question.getQuestions()
    window.location.href === 'file:///C:/' ? history.pushState([questions, userProfile], 'Home Page', window.location.href) : null
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
  $(document).on('click', `a[data-href^="/question"]`, async (e) => {
    const id = e.target.getAttribute('data-id')
    const question = await Question.getById(id)
    await question.showQuestion()
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