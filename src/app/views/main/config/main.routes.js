import angular from 'angular';
import main from 'main/main';

main.config(mainConfig);

//@ngInject
function mainConfig($stateProvider) {

    $stateProvider.state('main', {
        url: '/',
        views: {
            content: {
                templateUrl: ''
            }
        }
    });
}

module.exports = main;