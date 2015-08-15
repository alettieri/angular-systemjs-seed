import angular from 'angular';
import 'angular-ui-router';
import mainContent from './partials/main.content';
import mainRoutes from './config/main.routes';
import MainController from './main.controller';

var main = angular.module('sampleApp.main', ['ui.router', mainContent.name])
  .config(mainRoutes)
  .controller('MainController', MainController)
;

export default main;
