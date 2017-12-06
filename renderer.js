'use strict'
const {electron, shell, remote, ipcRenderer} = require('electron')
const ipc = ipcRenderer

const TemplatesLoader = require('./app/templates/template-loader')
const UserController = require('./app/controller/UserController')
const RequestBuilder = require('./app/services/RequestBuilder')
const UserProfile = require('./app/controller/UserProfile')
const Question = require('./app/controller/Question')
const Answers = require('./app/controller/Answers')
const Observer = require('./app/observer/observer')
const Sugar = require('sugar')()
const win = remote.getCurrentWindow()
let clearMainContent = () => {
  const link_content = document.querySelector('.content')
  while (link_content.firstChild) {
    link_content.removeChild(link_content.firstChild)
  }
  return link_content
}
Observer.subscribe('script_loaded', {}, async (data) => {
  document.addEventListener('click', async function (e) {
    if (e.target.tagName === 'A' && e.target.hasAttribute('data-href')) {
      let link_content, questions = null
      switch (e.target.getAttribute('data-href')) {
        case '/logout':
          UserController.logout({access_token: localStorage.token})
          break
        case '/favorites':
          link_content = clearMainContent()
          questions = await Question.myFavorites()
          Question.eachRender(questions)
          link_content.insertAdjacentHTML('afterbegin', `<div class="u-heading-v1-1 g-bg-gray-light-v5 g-brd-primary g-mb-20 text-center g-font-weight-300"><h2 class="h3 u-heading-v1__title">My Favorites Questions</h2></div>`)
          break
        case '/myQuestions':
          link_content = clearMainContent()
          questions = await Question.myQuestions()
          Question.eachRender(questions)
          link_content.insertAdjacentHTML('afterbegin', `<div class="u-heading-v1-1 g-bg-gray-light-v5 g-brd-primary g-mb-20 text-center g-font-weight-300"><h2 class="h3 u-heading-v1__title">My Questions</h2></div>`)
          break
        case '/home':
          clearMainContent()
          questions = await Question.getQuestions()
          Question.eachRender(questions)
          break
        case '/question':
          const id = e.target.getAttribute('data-id')
          const question = await Question.getById(id)
          await question.showQuestion()
          break
      }
    }
  })
})

ipc.on('sidebar:initialize', async () => {
  const userProfile = new UserProfile()
  await userProfile.render()
  await TemplatesLoader.loadHeader(userProfile)

  Observer.subscribe('script_loaded', {}, async (data) => {
    clearMainContent()
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