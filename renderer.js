window.$ = window.jQuery = require('jquery');
global.Tether = require('tether');
global.Bootstrap = require('bootstrap');

import { remote } from 'electron';
import db from './app/data/dataStore';
import Auth from './app/services/stackExchangeAuth';
import SideBar from './app/controller/sidebar_controller.js'
import servicesApi from './src/javascript/stackexchange-service';
import questionServices from './src/javascript/question-service';

$(() => {
  Auth.login();
  const bar = new SideBar().render();
  // questionServices.getQuestions('/questions', {
  //   pagesize: 20,
  //   order: 'desc',
  //   sort: 'activity',
  //   tagged: "ruby-on-rails"
  // });
});