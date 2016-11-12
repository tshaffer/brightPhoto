const fs = require('fs');
const path = require('path');

const xml2js = require('xml2js');

export default class App {

    constructor() {
        console.log("instantiate app");
        console.log("attach debugger now");
        setTimeout( () => {
            this.run();
        }, 1000);
    }

    run() {

        console.log("run app");
        const autorunVersion = "8.0.0"; // BA 5.0.0
        const customAutorunVersion = "8.0.0";

        let enableDebuggingPromise = this.enableDebugging();
        enableDebuggingPromise.then( (debugParamsFromSyncSpec) => {
            const debugParams = debugParamsFromSyncSpec;
            console.log("DebugParams", debugParams);
        });
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

        return new Promise( (resolve, reject) => {

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

                debugParams.serialDebugOn = enableSerialDebugging;
                debugParams.systemLogDebugOn = enableSystemLogDebugging;

                resolve(debugParams);
            })
            .catch(
                (reason) => {
                    console.log("failed to openCurrentSync");
                    console.log(reason);
                }
            );
        });
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