import angular from 'angular';
import 'angular-ui-router';
import main from 'app/views/main/config/main.routes';
angular.module('sampleApp', ['ui.router', 'sampleApp.main']);

angular.element(document).ready(function () {
    angular.bootstrap(document.body, ['sampleApp'], {
        // strictDi: true
    });
});
