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
        }, 2000);
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

        this.openCurrentSync().then( (syncContainer) => {
            console.log("return from openCurrentSync");
            console.log(syncContainer);

            // currentSync.sync.meta[0].client[0].enableSerialDebugging
            const syncSpec = syncContainer.sync;
            const meta = syncSpec.meta[0];
            const clientData = meta.client[0];
            const enableSerialDebugging = clientData.enableSerialDebugging;
            const enableSystemLogDebugging = clientData.enableSystemLogDebugging;

            console.log(syncSpec);
            console.log(meta);
            console.log(clientData);
            console.log(enableSerialDebugging);
            console.log(enableSystemLogDebugging);


        })
        .catch(
            (reason) => {
                console.log("failed to openCurrentSync");
                console.log(reason);
            }
        );

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

        const appPath = path.join(__dirname, "storage", "sd");
        const currentSyncPath = path.join(appPath, "current-sync.xml");

        return new Promise(function(resolve, reject) {
            fs.readFile(currentSyncPath, (err, data) => {

                if (err) {
                    console.log("failed to read current-sync.xml");
                    reject(err);
                }

                var parser = new xml2js.Parser();
                parser.parseString(data, function (err, result) {
                    resolve(result);
                });
            });
        });
    }
}