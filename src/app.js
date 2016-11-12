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

        // start video playback
        const v = document.getElementsByTagName("video")[0];
        console.log("v");
        console.log(v);
        v.play();
    }

    enableDebugging() {

        let debugParams = {};

        debugParams.serialDebugOn = false;
        debugParams.systemLogDebugOn = false;

        return new Promise( (resolve, reject) => {
            this.readCurrentSync().then( (syncSpecContainer) => {
                console.log("return from openCurrentSync");
                console.log(syncSpecContainer);

                // currentSync.sync.meta[0].client[0].enableSerialDebugging
                const syncSpec = syncSpecContainer.sync;
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
            });
        });
    }

    readCurrentSync() {
        return new Promise( (resolve, reject) => {
            this.readAppFile("current-sync.xml").then( (xmlData) => {
                this.convertXmlToJson(xmlData).then( (syncSpecContainer) => {
                    resolve(syncSpecContainer);
                })
                .catch(
                    (reason) => {
                        console.log("failed to convertXmlToJson");
                        console.log(reason);
                    }
                );
            })
            .catch(
                (reason) => {
                    console.log("failed to readAppFile");
                    console.log(reason);
                }
            );
        });
    }

    readAppFile(filePath) {

        const appPath = path.join(__dirname, "storage", "sd");
        const fullPath = path.join(appPath, filePath);

        return new Promise( (resolve, reject) => {
            fs.readFile(fullPath, (err, data) => {

                if (err) {
                    console.log("error reading file in readAppFile");
                    console.log(err);
                    reject(err);
                }

                resolve(data);
            });
        });
    }

    convertXmlToJson(xml) {

        return new Promise( (resolve, reject) => {

            var parser = new xml2js.Parser();
            parser.parseString(xml, function (err, jsonResult) {

                if (err) {
                    console.log("parse error in convertXmlToJson");
                    console.log(err);
                    reject(err);
                }
                resolve(jsonResult);
            });
        });
    }
}