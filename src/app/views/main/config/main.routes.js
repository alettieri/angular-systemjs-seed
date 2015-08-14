import angular from 'angular';
import main from 'app/views/main/main.module';
import mainContentTemplate from '../partials/main.content'

main.config(mainConfig);

//@ngInject
function mainConfig($stateProvider) {

    $stateProvider.state('main', {
        url: '/',
        views: {
            content: {
                template: `<div>
                hello world
                </div>`
            }
        }
    });
}

export default main;