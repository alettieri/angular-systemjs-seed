'use strict';

class MainController {
    constructor() {
      var vm = this;
      vm.title = 'Main Body';
      vm.currentDate = (new Date()).toDateString();
    }
}

export default MainController;
