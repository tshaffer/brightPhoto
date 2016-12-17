const fs = require('fs');
const path = require('path');

export default class App {

    constructor() {
        console.log("instantiate app");
        console.log("attach debugger now");
        setTimeout( () => {
            this.run();
        }, 30000);
    }

    run() {
        console.log("run app");
    }

}