'use strict'
const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

const RequestBuilder = require('./app/services/RequestBuilder')
const UserProfile = require('./app/controller/UserProfile')
const Observer = require('./app/observer/observer')
global.Sugar = require('sugar')()
// global._ = require('lodash');
const TemplatesLoader = require('./app/templates/template-loader')

const win = remote.getCurrentWindow()

ipc.on('sidebar:initialize', async () => {
  const userProfile = new UserProfile()
  await userProfile.render()
  await TemplatesLoader.loadHeader(userProfile)
})

ipc.on('stackexchange:login', (event, data) => {
  localStorage.token = data.token
  Object.freeze(localStorage.token)
  win.webContents.send('sidebar:initialize')
})

