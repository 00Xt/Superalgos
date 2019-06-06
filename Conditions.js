﻿function newAAMastersPlottersTradingSimulationConditions() {

    const MODULE_NAME = "Conditions Plotter";
    const INFO_LOG = false;
    const ERROR_LOG = true;
    const INTENSIVE_LOG = false;
    const logger = newWebDebugLog();
    logger.fileName = MODULE_NAME;

    let thisObject = {

        // Main functions and properties.

        initialize: initialize,
        finalize: finalize,
        container: undefined,
        getContainer: getContainer,
        setTimePeriod: setTimePeriod,
        setDatetime: setDatetime,
        draw: draw,
        recalculateScale: recalculateScale,

        /* Events declared outside the plotter. */

        onDailyFileLoaded: onDailyFileLoaded,

        // Secondary functions and properties.

        currentRecord: undefined
    };

    /* this is part of the module template */

    let container = newContainer();     // Do not touch this 3 lines, they are just needed.
    container.initialize();
    thisObject.container = container;

    let timeLineCoordinateSystem = newTimeLineCoordinateSystem();       // Needed to be able to plot on the timeline, otherwise not.

    let timePeriod;                     // This will hold the current Time Period the user is at.
    let datetime;                       // This will hold the current Datetime the user is at.

    let marketFile;                     // This is the current Market File being plotted.
    let fileCursor;                     // This is the current File Cursor being used to retrieve Daily Files.

    let marketFiles;                      // This object will provide the different Market Files at different Time Periods.
    let dailyFiles;                // This object will provide the different File Cursors at different Time Periods.

    /* these are module specific variables: */

    let conditions = [];
    let headers;

    return thisObject;

    function finalize() {
        try {

            if (INFO_LOG === true) { logger.write("[INFO] finalize -> Entering function."); }

            /* Stop listening to the necesary events. */

            viewPort.eventHandler.stopListening("Zoom Changed", onZoomChanged);
            viewPort.eventHandler.stopListening("Offset Changed", onOffsetChanged);
            marketFiles.eventHandler.stopListening("Files Updated", onFilesUpdated);
            canvas.eventHandler.stopListening("Drag Finished", onDragFinished);
            thisObject.container.eventHandler.stopListening('Dimmensions Changed')

            /* Destroyd References */

            marketFiles = undefined;
            dailyFiles = undefined;

            datetime = undefined;
            timePeriod = undefined;

            marketFile = undefined;
            fileCursor = undefined;

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] finalize -> err = " + err.stack); }
        }
    }

    function initialize(pStorage, pExchange, pMarket, pDatetime, pTimePeriod, callBackFunction) {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] initialize -> Entering function."); }

            /* Store the information received. */

            marketFiles = pStorage.marketFiles[0];
            dailyFiles = pStorage.dailyFiles[0];

            datetime = pDatetime;
            timePeriod = pTimePeriod;

            /* We need a Market File in order to calculate the Y scale, since this scale depends on actual data. */

            marketFile = marketFiles.getFile(ONE_DAY_IN_MILISECONDS);  // This file is the one processed faster. 

            recalculateScale();

            /* Now we set the right files according to current Period. */

            marketFile = marketFiles.getFile(pTimePeriod);
            fileCursor = dailyFiles.getFileCursor(pTimePeriod);

            /* Listen to the necesary events. */

            viewPort.eventHandler.listenToEvent("Zoom Changed", onZoomChanged);
            viewPort.eventHandler.listenToEvent("Offset Changed", onOffsetChanged);
            marketFiles.eventHandler.listenToEvent("Files Updated", onFilesUpdated);
            canvas.eventHandler.listenToEvent("Drag Finished", onDragFinished);

            /* Get ready for plotting. */

            recalculate();

            /* Ready for when dimmension changes. */

            thisObject.container.eventHandler.listenToEvent('Dimmensions Changed', function () {
                recalculateScale()
                recalculate();
            })

            callBackFunction();

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] initialize -> err = " + err.stack); }
        }
    }

    function getContainer(point) {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] getContainer -> Entering function."); }

            let container;

            /* First we check if this point is inside this space. */

            if (this.container.frame.isThisPointHere(point) === true) {

                return this.container;

            } else {

                /* This point does not belong to this space. */

                return undefined;
            }

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] getContainer -> err = " + err.stack); }
        }
    }

    function onFilesUpdated() {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] onFilesUpdated -> Entering function."); }

            let newMarketFile = marketFiles.getFile(timePeriod);

            if (newMarketFile !== undefined) {

                marketFile = newMarketFile;
                recalculate();
            }

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] onFilesUpdated -> err = " + err.stack); }
        }
    }

    function setTimePeriod(pTimePeriod) {

        try {

            if (timePeriod !== pTimePeriod) {

                timePeriod = pTimePeriod;

                if (timePeriod >= _1_HOUR_IN_MILISECONDS) {

                    marketFile = marketFiles.getFile(pTimePeriod);

                    recalculate();

                } else {

                    let newFileCursor = dailyFiles.getFileCursor(pTimePeriod);

                    fileCursor = newFileCursor; // In this case, we explicitly want that if there is no valid cursor, we invalidate the data and show nothing.
                    recalculate();

                }
            }

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] setTimePeriod -> err = " + err.stack); }
        }
    }

    function setDatetime(pDatetime) {

        if (INFO_LOG === true) { logger.write("[INFO] setDatetime -> Entering function."); }

        datetime = pDatetime;

    }

    function onDailyFileLoaded(event) {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] onDailyFileLoaded -> Entering function."); }

            if (event.currentValue === event.totalValue) {

                /* This happens only when all of the files in the cursor have been loaded. */

                recalculate();

            }

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] onDailyFileLoaded -> err = " + err.stack); }
        }
    }

    function draw() {

        try {

            if (INTENSIVE_LOG === true) { logger.write("[INFO] draw -> Entering function."); }

            this.container.frame.draw();

            plotChart();

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] draw -> err = " + err.stack); }
        }
    }

    function recalculate() {

        try {

            conditions = []

            if (timePeriod >= _1_HOUR_IN_MILISECONDS) {

                recalculateUsingMarketFiles();

            } else {

                recalculateUsingDailyFiles();

            }

            thisObject.container.eventHandler.raiseEvent("Conditions Changed", conditions);

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] recalculate -> err = " + err.stack); }
        }
    }

    function recalculateUsingDailyFiles() {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] recalculateUsingDailyFiles -> Entering function."); }

            if (fileCursor === undefined) {
                conditions = [];
                return;
            } // We need to wait

            if (fileCursor.files.size === 0) {
                conditions = [];
                return;
            } // We need to wait until there are files in the cursor

            let daysOnSides = getSideDays(timePeriod);

            let leftDate = getDateFromPoint(viewPort.visibleArea.topLeft, thisObject.container, timeLineCoordinateSystem);
            let rightDate = getDateFromPoint(viewPort.visibleArea.topRight, thisObject.container, timeLineCoordinateSystem);

            let dateDiff = rightDate.valueOf() - leftDate.valueOf();

            let farLeftDate = new Date(leftDate.valueOf() - dateDiff * 1.5);
            let farRightDate = new Date(rightDate.valueOf() + dateDiff * 1.5);

            let currentDate = new Date(farLeftDate.valueOf());

            conditions = [];
            
     

            while (currentDate.valueOf() <= farRightDate.valueOf() + ONE_DAY_IN_MILISECONDS) {

                let stringDate = currentDate.getFullYear() + '-' + pad(currentDate.getMonth() + 1, 2) + '-' + pad(currentDate.getDate(), 2);

                let dailyFile = fileCursor.files.get(stringDate);

                if (dailyFile !== undefined) {

                    headers = dailyFile[0];

                    for (let i = 0; i < dailyFile[2].length; i++) {

                        let record = {
                            begin: undefined,
                            end: undefined,
                            conditions: undefined
                        };

                        record.begin = dailyFile[2][i][0];
                        record.end = dailyFile[2][i][1];
                        record.strategyNumber = dailyFile[2][i][2];
                        record.strategyPhase = dailyFile[2][i][3];
                        record.stopLossPhase = dailyFile[2][i][4];
                        record.takeProfitPhase = dailyFile[2][i][5];
                        record.conditions = dailyFile[2][i][6];

                        if (record.begin >= farLeftDate.valueOf() && record.end <= farRightDate.valueOf()) {

                            conditions.push(record);

                            if (datetime.valueOf() >= record.begin && datetime.valueOf() <= record.end) {

                                thisObject.currentRecord = record;
                                thisObject.container.eventHandler.raiseEvent("Current Condition Changed", thisObject.currentRecord);

                            }
                        }
                    }
                }

                currentDate = new Date(currentDate.valueOf() + ONE_DAY_IN_MILISECONDS);
            }

            /* Lests check if all the visible screen is going to be covered by conditions. */

            let lowerEnd = leftDate.valueOf();
            let upperEnd = rightDate.valueOf();

            if (conditions.length > 0) {

                if (conditions[0].begin > lowerEnd || conditions[conditions.length - 1].end < upperEnd) {

                    setTimeout(recalculate, 2000);

                    //console.log("File missing while calculating conditions, scheduling a recalculation in 2 seconds.");

                }
            }

            //console.log("Olivia > recalculateUsingDailyFiles > total conditions generated : " + conditions.length);

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] recalculateUsingDailyFiles -> err = " + err.stack); }
        }
    }

    function recalculateUsingMarketFiles() {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] recalculateUsingMarketFiles -> Entering function."); }

            if (marketFile === undefined) { return; } // Initialization not complete yet.

            let daysOnSides = getSideDays(timePeriod);

            let leftDate = getDateFromPoint(viewPort.visibleArea.topLeft, thisObject.container, timeLineCoordinateSystem);
            let rightDate = getDateFromPoint(viewPort.visibleArea.topRight, thisObject.container, timeLineCoordinateSystem);

            let dateDiff = rightDate.valueOf() - leftDate.valueOf();

            leftDate = new Date(leftDate.valueOf() - dateDiff * 1.5);
            rightDate = new Date(rightDate.valueOf() + dateDiff * 1.5);

            conditions = [];
            headers = marketFile[0];
            let lastObjects = marketFile[1]; // Here we get the values of the last 5 objects

            for (let i = 0; i < marketFile[2].length; i++) {

                let record = {
                    begin: undefined,
                    end: undefined,
                    conditions: undefined
                };

                record.begin = marketFile[2][i][0];
                record.end = marketFile[2][i][1];
                record.strategyNumber = marketFile[2][i][2];
                record.strategyPhase = marketFile[2][i][3];
                record.stopLossPhase = marketFile[2][i][4];
                record.takeProfitPhase = marketFile[2][i][5];
                record.conditions = marketFile[2][i][6];

                if (record.begin >= leftDate.valueOf() && record.end <= rightDate.valueOf()) {

                    conditions.push(record);

                    if (datetime.valueOf() >= record.begin && datetime.valueOf() <= record.end) {

                        thisObject.currentRecord = record;
                        thisObject.container.eventHandler.raiseEvent("Current Condition Changed", thisObject.currentRecord);

                    }
                }
            }

            //console.log("Olivia > recalculateUsingMarketFiles > total conditions generated : " + conditions.length);

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] recalculateUsingMarketFiles -> err = " + err.stack); }
        }
    }

    function recalculateScale() {

        try {


            if (timeLineCoordinateSystem.maxValue > 0) { return; } // Already calculated.

            let minValue = {
                x: MIN_PLOTABLE_DATE.valueOf(),
                y: 0
            };

            let maxValue = {
                x: MAX_PLOTABLE_DATE.valueOf(),
                y: nextPorwerOf10(USDT_BTC_HTH) / 4 // TODO: This 4 is temporary
            };


            timeLineCoordinateSystem.initialize(
                minValue,
                maxValue,
                thisObject.container.frame.width,
                thisObject.container.frame.height
            );

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] recalculateScale -> err = " + err.stack); }
        }
    }

    function plotChart() {

        try {

            let userPosition = getUserPosition()
            let userPositionDate = userPosition.point.x

            thisObject.container.eventHandler.raiseEvent("Current Condition Record Changed", undefined);

            let conditionRecord;

            for (let i = 0; i < conditions.length; i++) { 

                conditionRecord = conditions[i];

                /* Send the current record to the panel */
      
                if (userPositionDate >= conditionRecord.begin && userPositionDate <= conditionRecord.end) {

                    let currentRecord = {
                        conditionsNames: headers,
                        strategyNumber: conditionRecord.strategyNumber,
                        strategyPhase: conditionRecord.strategyPhase,
                        stopLossPhase: conditionRecord.stopLossPhase,
                        takeProfitPhase: conditionRecord.takeProfitPhase,
                        conditionsValues: conditionRecord.conditions
                    };
                     
                    sendRecordInfoToStrategySpace(currentRecord)
                }
            }

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] plotChart -> err = " + err.stack); }
        }
    }

    function sendRecordInfoToStrategySpace(currentRecord) {

        if (currentRecord === undefined) { return; }
        if (currentRecord.conditionsNames === undefined) { return; }
        if (canvas.strategySpace.workspace === undefined) { return; }

        browserCanvasContext.beginPath();

        let tradingSystem = currentRecord.conditionsNames;
        let conditionIndex = 0;

        for (let j = 0; j < tradingSystem.strategies.length; j++) {

            let strategy = tradingSystem.strategies[j];

            if (currentRecord.strategyNumber - 1 === j) {
                canvas.strategySpace.workspace.tradingSystem.strategies[j].payload.uiObject.isExecuting = true
            } else {
                canvas.strategySpace.workspace.tradingSystem.strategies[j].payload.uiObject.isExecuting = false
            }

            let triggerStage = strategy.triggerStage

            if (triggerStage !== undefined) {

                if (triggerStage.triggerOn !== undefined) {

                    for (let k = 0; k < triggerStage.triggerOn.situations.length; k++) {

                        let situation = triggerStage.triggerOn.situations[k];

                        processSituation(situation, canvas.strategySpace.workspace.tradingSystem.strategies[j].triggerStage.triggerOn.situations[k]);
                    }
                }

                if (triggerStage.triggerOff !== undefined) {

                    for (let k = 0; k < triggerStage.triggerOff.situations.length; k++) {

                        let situation = triggerStage.triggerOff.situations[k];

                        processSituation(situation, canvas.strategySpace.workspace.tradingSystem.strategies[j].triggerStage.triggerOff.situations[k]);
                    }
                }

                if (triggerStage.takePosition !== undefined) {

                    for (let k = 0; k < triggerStage.takePosition.situations.length; k++) {

                        let situation = triggerStage.takePosition.situations[k];

                        processSituation(situation, canvas.strategySpace.workspace.tradingSystem.strategies[j].triggerStage.takePosition.situations[k]);
                    }
                }
            }

            let openStage = strategy.openStage

            if (openStage !== undefined) {

                let initialDefinition = openStage.initialDefinition

                if (initialDefinition !== undefined) {

                    if (initialDefinition.stopLoss !== undefined) {

                        for (let p = 0; p < initialDefinition.stopLoss.phases.length; p++) {

                            if (currentRecord.strategyNumber - 1 === j && currentRecord.stopLossPhase - 1 === p) {
                                canvas.strategySpace.workspace.tradingSystem.strategies[j].openStage.initialDefinition.stopLoss.phases[p].payload.uiObject.isExecuting = true
                            } else {
                                canvas.strategySpace.workspace.tradingSystem.strategies[j].openStage.initialDefinition.stopLoss.phases[p].payload.uiObject.isExecuting = false
                            }

                            let phase = initialDefinition.stopLoss.phases[p];

                            let nextPhaseEvent = phase.nextPhaseEvent;
                            if (nextPhaseEvent !== undefined) {

                                for (let k = 0; k < nextPhaseEvent.situations.length; k++) {

                                    let situation = nextPhaseEvent.situations[k];

                                    processSituation(situation, canvas.strategySpace.workspace.tradingSystem.strategies[j].openStage.initialDefinition.stopLoss.phases[p].nextPhaseEvent.situations[k]);
                                }
                            }
                        }
                    }

                    if (initialDefinition.takeProfit !== undefined) {

                        for (let p = 0; p < initialDefinition.takeProfit.phases.length; p++) {

                            if (currentRecord.strategyNumber - 1 === j && currentRecord.stopLossPhase - 1 === p) {
                                canvas.strategySpace.workspace.tradingSystem.strategies[j].openStage.initialDefinition.takeProfit.phases[p].payload.uiObject.isExecuting = true
                            } else {
                                canvas.strategySpace.workspace.tradingSystem.strategies[j].openStage.initialDefinition.takeProfit.phases[p].payload.uiObject.isExecuting = false
                            }

                            let phase = initialDefinition.takeProfit.phases[p];

                            let nextPhaseEvent = phase.nextPhaseEvent;
                            if (nextPhaseEvent !== undefined) {

                                for (let k = 0; k < nextPhaseEvent.situations.length; k++) {

                                    let situation = nextPhaseEvent.situations[k];

                                    processSituation(situation, canvas.strategySpace.workspace.tradingSystem.strategies[j].openStage.initialDefinition.takeProfit.phases[p].nextPhaseEvent.situations[k]);
                                }
                            }
                        }
                    }
                }
            }

            let manageStage = strategy.manageStage

            if (manageStage !== undefined) {

                if (manageStage.stopLoss !== undefined) {

                    for (let p = 0; p < manageStage.stopLoss.phases.length; p++) {

                        if (currentRecord.strategyNumber - 1 === j && currentRecord.stopLossPhase - 2 === p) {
                            canvas.strategySpace.workspace.tradingSystem.strategies[j].manageStage.stopLoss.phases[p].payload.uiObject.isExecuting = true
                        } else {
                            canvas.strategySpace.workspace.tradingSystem.strategies[j].manageStage.stopLoss.phases[p].payload.uiObject.isExecuting = false
                        }

                        let phase = manageStage.stopLoss.phases[p];

                        let nextPhaseEvent = phase.nextPhaseEvent;
                        if (nextPhaseEvent !== undefined) {

                            for (let k = 0; k < nextPhaseEvent.situations.length; k++) {

                                let situation = nextPhaseEvent.situations[k];

                                processSituation(situation, canvas.strategySpace.workspace.tradingSystem.strategies[j].manageStage.stopLoss.phases[p].nextPhaseEvent.situations[k]);
                            }
                        }
                    }
                }

                if (manageStage.takeProfit !== undefined) {

                    for (let p = 0; p < manageStage.takeProfit.phases.length; p++) {

                        if (currentRecord.strategyNumber - 1 === j && currentRecord.stopLossPhase - 2 === p) {
                            canvas.strategySpace.workspace.tradingSystem.strategies[j].manageStage.takeProfit.phases[p].payload.uiObject.isExecuting = true
                        } else {
                            canvas.strategySpace.workspace.tradingSystem.strategies[j].manageStage.takeProfit.phases[p].payload.uiObject.isExecuting = false
                        }

                        let phase = manageStage.takeProfit.phases[p];

                        let nextPhaseEvent = phase.nextPhaseEvent;
                        if (nextPhaseEvent !== undefined) {

                            for (let k = 0; k < nextPhaseEvent.situations.length; k++) {

                                let situation = nextPhaseEvent.situations[k];

                                processSituation(situation, canvas.strategySpace.workspace.tradingSystem.strategies[j].manageStage.takeProfit.phases[p].nextPhaseEvent.situations[k]);
                            }
                        }
                    }
                }
            }
        }

        function processSituation(situation, node) {

            let highlightSituation = true

            for (let m = 0; m < situation.conditions.length; m++) {
                if (currentRecord.conditionsValues[conditionIndex] === 1) {
                    node.conditions[m].payload.uiObject.highlight()
                } else {
                    node.conditions[m].payload.uiObject.unHighlight()
                    highlightSituation = false
                }
                conditionIndex++;
            }

            if (highlightSituation === true) {
                node.payload.uiObject.highlight()
            } else {
                node.payload.uiObject.unHighlight()
            }
        }


        browserCanvasContext.closePath();
        browserCanvasContext.fill();

    }



    function onZoomChanged(event) {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] onZoomChanged -> Entering function."); }

            recalculate();

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] onZoomChanged -> err = " + err.stack); }
        }
    }

    function onOffsetChanged() {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] onOffsetChanged -> Entering function."); }

            if (Math.random() * 100 > 95) {

                recalculate()
            };

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] onOffsetChanged -> err = " + err.stack); }
        }
    }

    function onDragFinished() {

        try {

            if (INFO_LOG === true) { logger.write("[INFO] onDragFinished -> Entering function."); }

            recalculate();

        } catch (err) {

            if (ERROR_LOG === true) { logger.write("[ERROR] onDragFinished -> err = " + err.stack); }
        }
    }
}

















