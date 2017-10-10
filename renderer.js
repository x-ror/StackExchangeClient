window.$ = window.jQuery = require('jquery');
global.Tether = require('tether');
global.Bootstrap = require('bootstrap');

const remote = require('electron').remote;
const auth = require("./src/javascript/stackexchange-auth");
const servicesApi = require('./src/javascript/stackexchange-service');
const questionServices = require('./src/javascript/question-service');

$(() => {
  const scb = (params) => {
    for (let [k, v] of Object.entries(params)) {
      localStorage.setItem(k, v);
    }
    servicesApi.fetch('/me', { access_token: localStorage.token }).then(response => {
      const name = response.items[0].display_name;
      document.querySelector(".container").insertAdjacentHTML('beforeend', '<button type="button" id="logOut" class="btn btn-lg">log uut</button>');
      document.querySelector('#logOut').addEventListener('click', () => {
        servicesApi.logOut({access_token: localStorage.token});
      
      });
      questionServices.getQuestions('/questions',{
        pagesize: 20, 
        order: 'desc',
        sort: 'activity',
        tagged: "ruby-on-rails"
      });
    });
  }
  auth.authentication(scb).
});