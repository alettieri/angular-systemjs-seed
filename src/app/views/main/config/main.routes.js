import mainContent from '../partials/main.content';

// @ngInject
function mainConfig($stateProvider, $urlRouterProvider) {
  'use strict';
    $stateProvider.state('main', {
        url: '/',
        views: {
            content: {
                templateUrl: mainContent.name,
                controllerAs: 'vm',
                controller: 'MainController'

            }
        }
    });

    $urlRouterProvider.otherwise('/');
}

export default mainConfig;
