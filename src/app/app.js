import angular from 'angular';
import 'angular-ui-router';
import main from 'app/views/main/main.module';

var app = angular.module('sampleApp', [main.name]);

angular.element(document).ready(function () {
    angular.bootstrap(document.body, [app.name], {
        //strictDi: true
    });
});


export default app;
