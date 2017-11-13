"use strict";
window.$ = window.jQuery = require('jquery');
global.Popper = require('popper.js');
global.Bootstrap = require('bootstrap');

const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const user = require('./app/controller/UserController');
const RequestServices = require('./app/services/RequestServices').request();
const UserProfile = require('./app/controller/UserProfile')._();
const Observer = require('./app/observer/pubsub').observer();

const win = remote.getCurrentWindow();
let statusLoad = false;
document.addEventListener('click', e => e.preventDefault());
Observer.subscribe('initLinks', status, data => {
    if ((statusLoad = data) === true) {
        document.querySelector('[data-link="questions"]').addEventListener('click', (e) => {
            console.log('questions');
        });
        document.querySelector('[data-link="users"]').addEventListener('click', (e) => {
            console.log('users');
        });
        document.querySelector('[data-link="tags"]').addEventListener('click', (e) => {
            console.log('tags');
        });
    }
    Observer.unsubscribe('initLinks');
});

ipc.on('sidebar:initialize', async (event)=>{
    const userProfile = new UserProfile();
    await userProfile.render();
    await renderHeader(userProfile);
    Observer.publish('initLinks', statusLoad = true)
});


ipc.on('stackexchange:login', (event, data) => {
    localStorage.token = data.token;
    Object.freeze(localStorage.token);
    win.webContents.send('sidebar:initialize');
});
const renderHeader = (userProfile) => {
    console.log(userProfile);
    document.body.insertAdjacentHTML('afterbegin', `
    <nav class="navbar navbar-expand-lg navbar-light bg-light p-0">
      <div class="container">
      
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <a class="" href="/">
                <img src="./app/assets/img/logo.png" height="40" alt="Stack Overflow">
            </a>
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" href="/">StackExchange <span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-link='questions' href='/questions' >Questions</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-link='tags' href='/tags' >Tags</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-link='users' href='/users' >Users</a>
              </li>
              <li  class="nav-item nav-item-form">
                <form class="form-inline my-2 my-lg-0">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
              </li>
            </ul>
            
            <a href="/" data-toggle="modal" data-target="#userProfileInformation${userProfile.id}" class="user-info float-lg-right px-lg-2">
                <div class="user-image">
                    <img src="${userProfile.profile['profile_image']}" 
                    height="40" alt="${userProfile.profile['display_name']}" 
                    data-toggle="tooltip" data-placement="bottom" 
                    title="${userProfile.profile['display_name']}"
                    class="rounded">
                </div>
                <div class="badges">
                    <span class="reputation">${userProfile.reputation.reputation}</span>
                    ${userProfile.badges.spanMap()}
                </div>
            </a>
          </div>
      </div>
    </nav>
    ${userProfile.showModal()}
    `);
    $('[data-toggle="tooltip"]').tooltip();

}

