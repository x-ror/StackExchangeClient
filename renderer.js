'use strict'
window.$ = window.jQuery = require('jquery')
global.Popper = require('popper.js')
global.Bootstrap = require('bootstrap')

const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

const RequestBuilder = require('./app/services/RequestBuilder')
const UserProfile = require('./app/controller/UserProfile')
const Observer = require('./app/observer/observer')

const win = remote.getCurrentWindow()

ipc.on('sidebar:initialize', async () => {
  const userProfile = new UserProfile()
  await userProfile.render()
})

ipc.on('stackexchange:login', (event, data) => {
  localStorage.token = data.token
  Object.freeze(localStorage.token)
  win.webContents.send('sidebar:initialize')
})

