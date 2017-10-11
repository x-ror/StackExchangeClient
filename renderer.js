window.$ = window.jQuery = require('jquery');
global.Tether = require('tether');
global.Bootstrap = require('bootstrap');

import { remote } from 'electron';
import db from './app/data/dataStore';
import Auth from './app/services/stackExchangeAuth';
import servicesApi from './src/javascript/stackexchange-service';
import questionServices from './src/javascript/question-service';

$(() => {
  Auth.login();
  servicesApi.fetch('/me', { access_token: db.get("access_token") }).then(response => {
    const name = response.items[0].display_name;
    document.querySelector(".container").insertAdjacentHTML('beforeend', '<button type="button" id="logOut" class="btn btn-lg">log uut</button>');
    document.querySelector('#logOut').addEventListener('click', () => {
      servicesApi.logOut({ access_token: localStorage.token });

    });
    questionServices.getQuestions('/questions', {
      pagesize: 20,
      order: 'desc',
      sort: 'activity',
      tagged: "ruby-on-rails"
    });
  });
});