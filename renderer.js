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

