"use strict";
window.$ = window.jQuery = require('jquery');
global.Tether = require('tether');
global.Bootstrap = require('bootstrap');

const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const user = require('./app/controller/UserController');
const RequestServices = require('./app/services/RequestServices').request();
const UserProfile = require('./app/controller/UserProfile')._();
const win = remote.getCurrentWindow();
let profile;
const container = document.querySelector('.container');

ipc.on('sidebar:initialize', async (event)=>{
    const userProfile = new UserProfile();
    await userProfile.render();
    renderHeader(userProfile);
});

ipc.on('stackexchange:login', (event, data) => {
    localStorage.token = data.token;
    Object.freeze(localStorage.token);
    win.webContents.send('sidebar:initialize');
});
const renderHeader = (userProfile) => {
    container.innerHTML = `
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" 
      aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">StackExchange</a>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link nav-link-active" rel="nofollow">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" rel="nofollow">Add Question</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" rel="nofollow">Users</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" rel="nofollow">Tags</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown link
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>`;
}