'use strict'
const {remote, ipcRenderer, clipboard} = require('electron')
const ipc = ipcRenderer

const TemplatesLoader = require('./app/templates/template-loader')
const UserController = require('./app/controller/UserController')
const UserProfile = require('./app/controller/UserProfile')
const Question = require('./app/controller/Question')
// const Answers = require('./app/controller/Answers')
const Observer = require('./app/observer/observer')
const Search = require('./app/controller/Search')
require('sugar')()
const win = remote.getCurrentWindow()
let clearMainContent = () => {
  const link_content = document.querySelector('.content')
  while (link_content.firstChild) {
    link_content.removeChild(link_content.firstChild)
  }
  return link_content
}

let showAlert = function (copy_messages) {
  document.querySelector('.content').insertAdjacentHTML('afterbegin', `
  <div class="col-lg-12">
    <div class="alert alert-dismissible fade show g-bg-teal g-color-white rounded-0" role="alert">
      <button type="button" class="close u-alert-close--light" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>

      <div class="media">
        <span class="d-flex g-mr-10 g-mt-5">
          <i class="icon-check g-font-size-25"></i>
        </span>
        <span class="media-body align-self-center">
          <strong>Well done!</strong> You successfully copied link <code>${copy_messages}</code>!
        </span>
      </div>
    </div>`)
  const alert = document.querySelector('.alert')
  $(alert).delay(2000).fadeOut(2000, () => {
    $(alert).remove()
  })
}
Observer.subscribe('script_loaded', {}, async () => {
  document.addEventListener('click', async function (e) {
    // e.preventDefault()
    if (e.target.tagName === 'A' && e.target.hasAttribute('data-href')) {
      let link = e.target.getAttribute('data-href')
      let link_content, questions = null
      const regExpForStackTags = /(tag\?)([\w\W]+)/g
      let tag = ''
      let m
      if ((m = regExpForStackTags.exec(link)) !== null) {
        link = '/tag'
        m.forEach((match, groupIndex) => {
          console.log(`Found match, group ${groupIndex}: ${match}`)
          if (groupIndex === 2)
            tag = match
        })
      }
      switch (link) {
        default:
          console.log(regExpForStackTags)
          break
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
        case '/tag':
          link_content = clearMainContent()
          questions = await Search.findByTagName(tag)
          Question.eachRender(questions)
          link_content.insertAdjacentHTML('afterbegin', `<div class="u-heading-v1-1 g-bg-gray-light-v5 g-brd-primary g-mb-20 text-center g-font-weight-300"><h2 class="h3 u-heading-v1__title">Search by <code>${tag}</code></h2></div>`)
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
    if (e.target.hasAttribute('data-clip')) {
      let copy = e.target.getAttribute('data-clip')
      clipboard.writeText(copy)
      showAlert(copy)
    }
  })
})

ipc.on('sidebar:initialize', async () => {
  const userProfile = new UserProfile()
  await userProfile.render()
  await TemplatesLoader.loadHeader(userProfile)

  Observer.subscribe('script_loaded', {}, async () => {
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
  $(document).on('click', '.add_post_link', async function () {
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