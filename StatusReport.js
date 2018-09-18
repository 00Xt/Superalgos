﻿exports.newStatusReport = function newStatusReport(BOT, logger, BLOB_STORAGE, UTILITIES) {

    /* 

    A Status Report is a file that every bot reads at the begining of its execution and saves after it finishes its job.
    The purpose of the file is to record checkpoint information of what was the last thing done by the bot and helpfull enough to start the next execution.
    It usually does not include business related context data.

    */

    const MODULE_NAME = "Status Report";

    let bot = BOT;

    let thisObject = {
        file: undefined,                    // Here we have the JSON object representing the file content.
        initialize: initialize,
        load: load,
        save: save,
        status: undefined,
        verifyMarketComplete: verifyMarketComplete
    };

    let owner;                       // This is the bot owner of the Status Report. Only owners can save the report and override the existing content.

    /* Utilities needed. */

    let utilities = UTILITIES.newCloudUtilities(bot, logger);

    /* Storage account to be used here. */

    let cloudStorage = BLOB_STORAGE.newBlobStorage(bot, logger);

    let month;
    let year;
    let timePath = '';

    return thisObject;

    function initialize(pOwner, pMonth, pYear, callBackFunction) {

        try {

            logger.fileName = MODULE_NAME + "." + pOwner.bot + "." + pOwner.process;

            owner = pOwner;
            month = pMonth;
            year = pYear;

            if (owner.dataSetSection === "Month") {

                logger.fileName = MODULE_NAME + "." + pOwner.bot + "." + pOwner.process + "." + year + "." + month;

                timePath = "/" + year + "/" + month; 
            }

            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] initialize -> Entering function."); }


            initializeStorage();

            function initializeStorage() {

                cloudStorage.initialize(owner.devTeam, onInizialized);

                function onInizialized(err) {

                    if (err.result === global.DEFAULT_OK_RESPONSE.result) {

                        if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] initialize -> initializeStorage -> onInizialized -> Entering function."); }
                        callBackFunction(global.DEFAULT_OK_RESPONSE);

                    } else {
                        logger.write(MODULE_NAME, "[ERROR] initialize -> initializeStorage -> onInizialized -> err = " + err.message);
                        callBackFunction(err);
                    }
                }
            }
        } catch (err) {
            logger.write(MODULE_NAME, "[ERROR] initialize -> err = " + err.message);
            callBackFunction(global.DEFAULT_FAIL_RESPONSE);
        }
    }

    function load(callBackFunction) {

        try {

            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] initialize -> load -> Entering function."); }

            let fileName = "Status.Report." + global.MARKET.assetA + '_' + global.MARKET.assetB + ".json";
            let filePath;

            let ownerId = owner.devTeam + "-" + owner.bot + "-" + owner.botVersion.major + "-" + owner.botVersion.minor + "-" + owner.process + "-" + owner.dataSetVersion;
            let botId = bot.devTeam + "-" + bot.codeName + "-" + bot.version.major + "-" + bot.version.minor + "-" + bot.process + "-" + bot.dataSetVersion;

            if (ownerId !== botId) {

                let rootPath = owner.devTeam + "/" + owner.bot + "." + owner.botVersion.major + "." + owner.botVersion.minor + "/" + global.PLATFORM_CONFIG.codeName + "." + global.PLATFORM_CONFIG.version.major + "." + global.PLATFORM_CONFIG.version.minor + "/" + global.EXCHANGE_NAME + "/" + owner.dataSetVersion;

                filePath = rootPath + "/Reports/" + owner.process + timePath;

            } else {

                filePath = bot.filePathRoot + "/Reports/" + owner.process + timePath;

            }

            if (owner.type === 'Trading') {
                fileName = bot.startMode + "." + fileName;
            }

            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] initialize -> load -> fileName = " + fileName); }
            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] initialize -> load -> filePath = " + filePath); }

            cloudStorage.getTextFile(filePath, fileName, onFileReceived);

            function onFileReceived(err, text) {

                if (
                    err.result === global.CUSTOM_FAIL_RESPONSE.result &&
                    (err.message === 'Folder does not exist.' || err.message === 'File does not exist.')
                ) {
                    logger.write(MODULE_NAME, "[INFO] initialize -> load -> onFileReceived -> err = " + err.message);

                    /* In this case we can assume that this is the first execution ever of this bot.*/

                    thisObject.file = JSON.parse('{}');

                    let customOK = {
                        result: global.CUSTOM_OK_RESPONSE.result,
                        message: "Status Report was never created."
                    };
                    logger.write(MODULE_NAME, "[WARN] initialize -> load -> onFileReceived -> customOK = " + customOK.message);
                    callBackFunction(customOK);
                    return;
                }

                if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
                    logger.write(MODULE_NAME, "[ERROR] initialize -> load -> onFileReceived -> err = " + err.message);
                    callBackFunction(err);
                    return;
                }

                if (global.LOG_CONTROL[MODULE_NAME].logContent === true) {
                    logger.write(MODULE_NAME, "[INFO] initialize -> load -> onFileReceived -> Content received = " + text);
                }

                try {

                    thisObject.file = JSON.parse(text);
                    callBackFunction(global.DEFAULT_OK_RESPONSE);

                } catch (err) {

                    /*
                    It might happen that the file content is corrupt. We will consider this as a temporary situation, since sometimes the file
                    is being updated at the moment of the read. The bot can not run without a valid Status Report but we can request the platform to retry later.
                    */

                    logger.write(MODULE_NAME, "[ERROR] initialize -> load -> onFileReceived -> Error Parsing the Status report. -> Err = " + err.message);

                    let customFail = {
                        result: global.CUSTOM_FAIL_RESPONSE.result,
                        message: "Status Report is corrupt."
                    };
                    logger.write(MODULE_NAME, "[WARN] initialize -> load -> onFileReceived -> customFail = " + customFail.message);
                    callBackFunction(customFail);
                    return;
                }
            }

        } catch (err) {
            logger.write(MODULE_NAME, "[ERROR] initialize -> load -> err = " + err.message);
            callBackFunction(global.DEFAULT_FAIL_RESPONSE);
        }
    }

    function save(callBackFunction) {

        try {

            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] save -> Entering function."); }

            let ownerId = owner.devTeam + "-" + owner.bot + "-" + owner.botVersion.major + "-" + owner.botVersion.minor + "-" + owner.process + "-" + owner.dataSetVersion;
            let botId = bot.devTeam + "-" + bot.codeName + "-" + bot.version.major + "-" + bot.version.minor + "-" + bot.process + "-" + bot.dataSetVersion;

            if (ownerId !== botId) {

                let customErr = {
                    result: global.CUSTOM_FAIL_RESPONSE.result,
                    message: "Only bots owners of a Status Report can save them."
                };
                logger.write(MODULE_NAME, "[ERROR] save -> customErr = " + customErr.message);
                callBackFunction(customErr);
                return;
            }

            let fileName = "Status.Report." + global.MARKET.assetA + '_' + global.MARKET.assetB + ".json";
            let filePath = bot.filePathRoot + "/Reports/" + owner.process + timePath;

            if (bot.type === 'Trading') {
                fileName = bot.startMode + "." + fileName;
            }

            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] save -> fileName = " + fileName); }
            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] save -> filePath = " + filePath); }

            let fileContent = JSON.stringify(thisObject.file);

            cloudStorage.createTextFile(filePath, fileName, fileContent + '\n', onFileCreated);

            function onFileCreated(err) {

                if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] save -> onFileCreated -> Entering function."); }

                if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
                    logger.write(MODULE_NAME, "[ERROR] save -> onFileCreated -> err = " + err.message);
                    callBackFunction(err);
                    return;
                }

                if (global.LOG_CONTROL[MODULE_NAME].logContent === true) {
                    logger.write(MODULE_NAME, "[INFO] save -> onFileCreated ->  Content written = " + fileContent);
                }

                callBackFunction(global.DEFAULT_OK_RESPONSE);
                return;
            }

        }
        catch (err) {
            logger.write(MODULE_NAME, "[ERROR] save -> err = " + err.message);
            callBackFunction(global.DEFAULT_FAIL_RESPONSE);
        }
    }

    function verifyMarketComplete(callBackFunction) {

    /*
    The mission of this function is to update the main status report on a scheme where there are monthly sub reports.
    This report contains the date of the last file sucessfully checked but in a consecutive way.

    For example: if the market starts in March, and March, April and June are checked, then the file will be the last of June even if September is also checked.

    IMPORTANT NOTE: Once executed, this function will leave thisObject in an inconsistant state, so you need to re-initialize it if you wish to use it again.

    */

        try {

            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> Entering function."); }

            let initialYear;
            let initialMonth;

            let finalYear = (new Date()).getUTCFullYear();
            let finalMonth = (new Date()).getUTCMonth() + 1;

            /* Lets load again this main status report as it might have changed since its initialization and first load. */

            load(onLoad);

            function onLoad(err) {

                try {

                    if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> onLoad -> Entering function."); }

                    if (
                        err.result === global.CUSTOM_FAIL_RESPONSE.result &&
                        (err.message === 'Status Report was never created.')
                    ) {
                        logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> onLoad -> err = " + err.message);

                        /* The first month of the market didnt create the main report yet. Aborting verification. */

                        if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> onLoad -> Verification ABORTED since the main status report does not exist."); }

                        callBackFunction(global.DEFAULT_OK_RESPONSE);
                        return;
                    }

                    if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
                        logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> onLoad -> err = " + err.message);
                        callBackFunction(err);
                        return;
                    }

                    /* Here we get the initial month and year from where our verification process will start. */

                    initialYear = thisObject.file.lastFile.year;
                    initialMonth = thisObject.file.lastFile.month;

                    loopCycle();

                } catch (err) {
                    logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> onLoad -> err = " + err.message);
                    callBackFunction(global.DEFAULT_FAIL_RESPONSE);
                    return;
                }
            }

            function loopCycle() {

                try {

                    if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> loopCycle -> Entering function."); }

                    /* Here we read the status report file of each month / year to verify if it is complete or not. */

                    let paddedInitialMonth = utilities.pad(initialMonth, 2);

                    timePath = "/" + initialYear + "/" + paddedInitialMonth;

                    load(onLoad);

                    function onLoad(err) {

                        try {

                            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> loopCycle -> onLoad -> Entering function."); }

                            if (
                                err.result === global.CUSTOM_FAIL_RESPONSE.result &&
                                (err.message === 'Status Report was never created.')
                            ) {
                                logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> loopCycle -> onLoad -> err = " + err.message);

                                /* The first month of the market didnt create the main report yet. Aborting verification. */

                                if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> loopCycle -> onLoad -> Verification ABORTED  since the status report for year  " + initialYear + " and month " + initialMonth + " did not exist. "); }

                                callBackFunction(global.DEFAULT_OK_RESPONSE);
                                return;
                            }

                            if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
                                logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> loopCycle -> onLoad -> err = " + err.message);
                                callBackFunction(err);
                                return;
                            }

                            if (thisObject.file.monthChecked === true) {

                                readAndWriteNewReport(JSON.stringify(thisObject.file));

                            } else {

                                /* If any of the files says that month is not checked then it is enough to know the market continuity is broken. */

                                if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> loopCycle -> onLoad -> Verification ABORTED since the status report for year  " + initialYear + " and month " + initialMonth + " is not marked as complete."); }

                                callBackFunction(global.DEFAULT_OK_RESPONSE);
                                return;
                            }

                        } catch (err) {
                            logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> loopCycle -> onLoad -> err = " + err.message);
                            callBackFunction(global.DEFAULT_FAIL_RESPONSE);
                            return;
                        }
                    }
                } catch (err) {
                    logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> loopCycle -> err = " + err.message);
                    callBackFunction(global.DEFAULT_FAIL_RESPONSE);
                    return;
                }
            }

            function readAndWriteNewReport(monthlyStatusReport) {

                try {

                    if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> readAndWriteNewReport -> Entering function."); }

                    /* We will read the current file to preserve its data, and save it again with the new lastFile */

                    monthlyStatusReport = JSON.parse(monthlyStatusReport);

                    timePath = "";

                    load(onLoad);

                    function onLoad(err) {

                        try {

                            if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> readAndWriteNewReport -> onLoad -> Entering function."); }

                            if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
                                logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> readAndWriteNewReport -> onLoad -> err = " + err.message);
                                callBackFunction(err);
                                return;
                            }

                            if (monthlyStatusReport.lastTrade.id > thisObject.file.lastTrade.id) {

                                thisObject.file.lastFile = monthlyStatusReport.lastFile;
                                thisObject.file.lastTrade = monthlyStatusReport.lastTrade;
                                thisObject.file.lastTrade.counter = undefined;

                                save(onSave);

                                function onSave(err) {

                                    try {

                                        if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> readAndWriteNewReport -> onLoad -> onSave -> Entering function."); }

                                        if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
                                            logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> readAndWriteNewReport -> onLoad -> onSave -> err = " + err.message);
                                            callBackFunction(err);
                                            return;
                                        }

                                        loop();  // Lets see the next month.

                                    } catch (err) {
                                        logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> readAndWriteNewReport -> onLoad -> onSave -> err = " + err.message);
                                        callBackFunction(global.DEFAULT_FAIL_RESPONSE);
                                        return;
                                    }
                                }

                            } else {

                                if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> readAndWriteNewReport -> onLoad -> Main Status Report Not Updated."); }
                                if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> readAndWriteNewReport -> onLoad -> Current Trade Id (" + monthlyStatusReport.lastTrade.id + ") is <= than Id at main status report file. (" + thisObject.file.lastTrade.id + ")"); }

                                loop();  // Lets see the next month.
                            }

                        } catch (err) {
                            logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> readAndWriteNewReport -> onLoad -> err = " + err.message);
                            callBackFunction(global.DEFAULT_FAIL_RESPONSE);
                            return;
                        }
                    }
                } catch (err) {
                    logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> loopCycle -> err = " + err.message);
                    callBackFunction(global.DEFAULT_FAIL_RESPONSE);
                    return;
                }
            }

            function loop() {

                try {

                    if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> loop -> Entering function."); }

                    initialMonth++;

                    if (initialMonth > 12) {

                        initialMonth = 1;
                        initialYear++;

                    }

                    if ((initialYear === finalYear && initialMonth > finalMonth) || (initialYear > finalYear)) {

                        /* We arrived to the point where we have checked all the status reports of every month and they are all complete. */

                        if (global.LOG_CONTROL[MODULE_NAME].logInfo === true) { logger.write(MODULE_NAME, "[INFO] verifyMarketComplete -> loop -> Verification Finished. Success."); }

                        callBackFunction(global.DEFAULT_OK_RESPONSE);
                        return;
                    }

                    loopCycle();

                } catch (err) {
                    logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> loop -> err = " + err.message);
                    callBackFunction(global.DEFAULT_FAIL_RESPONSE);
                    return;
                }
            }
        }
        catch (err)
        {
            logger.write(MODULE_NAME, "[ERROR] verifyMarketComplete -> err = " + err.message);
            callBackFunction(global.DEFAULT_FAIL_RESPONSE);
            return;
        }
    }
};