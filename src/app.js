const fs = require('fs');
const path = require('path');

const xml2js = require('xml2js');

export default class App {

    constructor() {
        console.log("instantiate app");
    }

    run() {
        console.log("run app");

        console.log("attach debugger now");
        setTimeout( () => {
            console.log("continue with run()");
            const autorunVersion = "8.0.0"; // BA 5.0.0
            const customAutorunVersion = "8.0.0";

            const debugParams = this.enableDebugging();
            console.log("DebugParams", debugParams);
        }, 20000);
    }

    enableDebugging() {

        let debugParams = {};

        debugParams.serialDebugOn = false;
        debugParams.systemLogDebugOn = false;

        console.log("dirname");
        console.log(__dirname);

        const appPath = path.join(__dirname, "storage", "sd");
        console.log(appPath);
        const currentSyncPath = path.join(appPath, "current-sync.xml");

        // fs.readdir(__dirname, function(err, items) {
        //     console.log("number of items is: ", items.length);
        //     console.log(items);
        // });

        const data = fs.readFileSync(currentSyncPath);

        // const currentSync = JSON.parse(data);

        var parser = new xml2js.Parser();
        parser.parseString(data, function (err, result) {
            console.log("parsed currentSync");
            console.log(result);

            console.log("now try invoking JSON.parse on result");
            const parsed = JSON.parse(result);
            console.log(parsed);
        });

        // this.openCurrentSync().then( (currentSync) => {
        //     console.log("return from openCurrentSync");
        //     console.log(currentSync);
        // })
        // .catch(
        //     (reason) => {
        //         console.log("failed to openCurrentSync");
        //         console.log(reason);
        //     }
        // );

        // syncSpec = CreateObject("roSyncSpec")
        // if syncSpec.ReadFromFile("current-sync.xml") or syncSpec.ReadFromFile("local-sync.xml") or syncSpec.ReadFromFile("localToBSN-sync.xml") or syncSpec.ReadFromFile("localSetupToStandalone-sync.xml") then
        // if syncSpec.LookupMetadata("client", "enableSerialDebugging") = "True" then
        // debugParams.serialDebugOn = true
        // endif
        // if syncSpec.LookupMetadata("client", "enableSystemLogDebugging") = "True" then
        // debugParams.systemLogDebugOn = true
        // endif
        // syncSpec = invalid
        // endif

        debugParams.serialDebugOn = true;
        debugParams.systemLogDebugOn = false;

        return debugParams;
    }

    openCurrentSync() {

        return new Promise(function(resolve, reject) {
            fs.readFile("current-sync.xml", (err, data) => {
                if (err) {
                    console.log("failed to read current-sync.xml");
                    reject(err);
                }
                const currentSync = JSON.parse(data);
                resolve(currentSync);
            });
        });
    }


}