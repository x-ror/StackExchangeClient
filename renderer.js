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
let page = 1
let tag = ''
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
let findMatch = (link) => {
  let m, tag = '', regExpForStackTags = /(tag\?)([\w\W]+)/g
  if ((m = regExpForStackTags.exec(link)) !== null) {
    link = '/tag'
    m.forEach((match, groupIndex) => {
      console.log(`Found match, group ${groupIndex}: ${match}`)
      if (groupIndex === 2)
        tag = match
    })
  }
  return {link, tag}
}
let renderPagination = ({page_type = 'home', page, isNext}) => {
  const navContent = document.querySelector('.nav_list')

  while (navContent.firstChild) {
    navContent.removeChild(navContent.firstChild)
  }

  navContent.insertAdjacentHTML('afterbegin',
    `<ul class="list-inline">
      <li class="list-inline-item">
          <a class="u-pagination-v1__item u-pagination-v1-2 g-pa-7-16 ${page ===
    1 ? 'u-pagination-v1__item--disabled' : null}" 
          data-href='${page_type}' data-page=${--page} aria-label="Previous">Previous
          </a>
      </li>
      <li class="list-inline-item g-hidden-sm-down ">
          <div class="u-pagination-v1__item u-pagination-v1-2 u-pagination-v1-2--active g-pa-7-14 current_page">
              ${++page}
          </div>
      </li>

      <li class="list-inline-item">
          <a class="u-pagination-v1__item u-pagination-v1-2 g-pa-7-16 ${!isNext
      ? 'u-pagination-v1__item--disabled'
      : null}" 
          data-href='${page_type}' data-page=${++page} aria-label="Next">Next
          </a>
      </li>
    </ul>`)
}

Observer.subscribe('script_loaded', {}, async () => {
  document.addEventListener('click', async function (e) {
    // e.preventDefault()
    if (e.target.tagName === 'A' && e.target.hasAttribute('data-href')) {
      let link = e.target.getAttribute('data-href'), link_content, _res
      page = e.target.getAttribute('data-page') || 1
      const __ref = findMatch(link)
      if (__ref) {
        link = __ref['link']
        tag = __ref['tag'] || tag
      }

      switch (link) {
        default:
          console.log(__ref)
          break
        case '/logout':
          UserController.logout({access_token: localStorage.token})
          break
        case '/favorites':
          link_content = clearMainContent()
          _res = await Question.myFavorites({page: page})
          Question.eachRender(_res['questions'])
          link_content.insertAdjacentHTML('afterbegin', `<div class="u-heading-v1-1 g-bg-gray-light-v5 g-brd-primary g-mb-20 text-center g-font-weight-300"><h2 class="h3 u-heading-v1__title">My Favorites Questions</h2></div>`)
          break
        case '/myQuestions':
          link_content = clearMainContent()
          _res = await Question.myQuestions({page: page})
          Question.eachRender(_res['questions'])
          link_content.insertAdjacentHTML('afterbegin', `<div class="u-heading-v1-1 g-bg-gray-light-v5 g-brd-primary g-mb-20 text-center g-font-weight-300"><h2 class="h3 u-heading-v1__title">My Questions</h2></div>`)
          break
        case '/tag':
          link_content = clearMainContent()
          _res = await Search.findByTagName({tag, page: page})
          Question.eachRender(_res['questions'])
          link_content.insertAdjacentHTML('afterbegin', `<div class="u-heading-v1-1 g-bg-gray-light-v5 g-brd-primary g-mb-20 text-center g-font-weight-300"><h2 class="h3 u-heading-v1__title">Search by <code>${tag}</code></h2></div>`)
          break
        case '/home':
          clearMainContent()
          _res = await Question.getQuestions({page: page})
          Question.eachRender(_res['questions'])
          break
        case '/question':
          const id = e.target.getAttribute('data-id')
          const question = await Question.getById(id)
          await question.showQuestion()
          break
      }
      if (['/favorites', '/myQuestions', '/tag', '/home'].includes(link))
        renderPagination(
          {page_type: link, isNext: _res['has_more'], page: page})
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
    const {questions, has_more} = await Question.getQuestions({page: 1})
    questions.map(question => question.render())
    renderPagination({page_type: '/home', isNext: has_more, page: page})
  })
})

ipc.on('stackexchange:login', (event, data) => {
  localStorage.token = data.token
  Object.freeze(localStorage.token)
  win.webContents.send('sidebar:initialize')
})