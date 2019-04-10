﻿
function newAAMastersPlottersCandlesVolumesCandlesCandlePanel() {

    var thisObject = {
        onEventRaised: onEventRaised,
        container: undefined,
        draw: draw,
        getContainer: getContainer,
        initialize: initialize
    };

    var container = newContainer();
    container.initialize();
    thisObject.container = container;

    container.displacement.containerName = "Current Candle Panel";
    container.frame.containerName = "Current Candle Panel";

    let currentCandle;
    let panelTabButton

    return thisObject;

    function initialize() {

        thisObject.container.frame.width = UI_PANEL.WIDTH.NORMAL;
        thisObject.container.frame.height = UI_PANEL.HEIGHT.NORMAL;

        thisObject.container.frame.position.x = viewPort.visibleArea.topRight.x - thisObject.container.frame.width * 2;
        thisObject.container.frame.position.y = viewPort.visibleArea.bottomLeft.y - thisObject.container.frame.height;

        panelTabButton = newPanelTabButton()
        panelTabButton.parentContainer = thisObject.container
        panelTabButton.container.frame.parentFrame = thisObject.container.frame
        panelTabButton.initialize()
    }

    function getContainer(point) {

        var container;

        container = panelTabButton.getContainer(point)
        if (container !== undefined) { return container }

        /* First we check if this point is inside this space. */

        if (thisObject.container.frame.isThisPointHere(point, true) === true) {

            return thisObject.container;

        } else {

            /* This point does not belong to this space. */

            return undefined;
        }

    }


    function onEventRaised(lastCurrentCandle) {

        currentCandle = lastCurrentCandle;

    }


    function draw() {

        thisObject.container.frame.draw(false, false, true);

        plotCurrentCandleInfo();

        panelTabButton.draw()
    }


    function plotCurrentCandleInfo() {

        if (currentCandle === undefined) { return; }
        if (currentCandle.innerCandle === undefined) { return; }

        const frameBodyHeight = thisObject.container.frame.getBodyHeight();
        const frameTitleHeight = thisObject.container.frame.height - frameBodyHeight;

        const X_AXIS = thisObject.container.frame.width / 2;
        const Y_AXIS = frameTitleHeight + frameBodyHeight / 2;
 
        var candlePoint1 = {
            x: X_AXIS - currentCandle.bodyWidth / 2,
            y: Y_AXIS - currentCandle.bodyHeight / 2 
        };

        var candlePoint2 = {
            x: X_AXIS + currentCandle.bodyWidth / 2,
            y: Y_AXIS - currentCandle.bodyHeight / 2
        };

        var candlePoint3 = {
            x: X_AXIS + currentCandle.bodyWidth / 2,
            y: Y_AXIS + currentCandle.bodyHeight / 2
        };

        var candlePoint4 = {
            x: X_AXIS - currentCandle.bodyWidth / 2,
            y: Y_AXIS + currentCandle.bodyHeight / 2 
        };


        var stickPoint1 = {
            x: X_AXIS - currentCandle.stickWidth / 2,
            y: candlePoint1.y - currentCandle.stickStart
        };

        var stickPoint2 = {
            x: X_AXIS + currentCandle.stickWidth / 2,
            y: candlePoint1.y - currentCandle.stickStart
        };

        var stickPoint3 = {
            x: X_AXIS + currentCandle.stickWidth / 2,
            y: candlePoint1.y - currentCandle.stickStart + currentCandle.stickHeight 
        };

        var stickPoint4 = {
            x: X_AXIS - currentCandle.stickWidth / 2,
            y: candlePoint1.y - currentCandle.stickStart + currentCandle.stickHeight 
        };


        /* Extra bounderies due to constrained space */

        const upperLimit = frameTitleHeight + frameBodyHeight * 0.15;
        const downLimit = frameTitleHeight + frameBodyHeight * 0.85;

        if (candlePoint1.y < upperLimit) {

            candlePoint1.y = upperLimit;
            candlePoint2.y = upperLimit;

        }

        if (stickPoint1.y < upperLimit) {

            stickPoint1.y = upperLimit;
            stickPoint2.y = upperLimit;

        }

        if (candlePoint3.y < upperLimit) {

            candlePoint3.y = upperLimit;
            candlePoint4.y = upperLimit;

        }

        if (stickPoint3.y < upperLimit) {

            stickPoint3.y = upperLimit;
            stickPoint4.y = upperLimit;

        }

        if (candlePoint1.y > downLimit) {

            candlePoint1.y = downLimit;
            candlePoint2.y = downLimit;

        }

        if (stickPoint1.y > downLimit) {

            stickPoint1.y = downLimit;
            stickPoint2.y = downLimit;

        }

        if (candlePoint3.y > downLimit) {

            candlePoint3.y = downLimit;
            candlePoint4.y = downLimit;

        }

        if (stickPoint3.y > downLimit) {

            stickPoint3.y = downLimit;
            stickPoint4.y = downLimit;

        }


        candlePoint1 = thisObject.container.frame.frameThisPoint(candlePoint1);
        candlePoint2 = thisObject.container.frame.frameThisPoint(candlePoint2);
        candlePoint3 = thisObject.container.frame.frameThisPoint(candlePoint3);
        candlePoint4 = thisObject.container.frame.frameThisPoint(candlePoint4);

        stickPoint1 = thisObject.container.frame.frameThisPoint(stickPoint1);
        stickPoint2 = thisObject.container.frame.frameThisPoint(stickPoint2);
        stickPoint3 = thisObject.container.frame.frameThisPoint(stickPoint3);
        stickPoint4 = thisObject.container.frame.frameThisPoint(stickPoint4);



        browserCanvasContext.beginPath();

        browserCanvasContext.moveTo(stickPoint1.x, stickPoint1.y);
        browserCanvasContext.lineTo(stickPoint2.x, stickPoint2.y);
        browserCanvasContext.lineTo(stickPoint3.x, stickPoint3.y);
        browserCanvasContext.lineTo(stickPoint4.x, stickPoint4.y);

        browserCanvasContext.closePath();
        browserCanvasContext.fillStyle = 'rgba(' + UI_COLOR.DARK + ', 1)';
        browserCanvasContext.fill();

        browserCanvasContext.lineWidth = 1;
        browserCanvasContext.stroke();

        browserCanvasContext.beginPath();

        browserCanvasContext.moveTo(candlePoint1.x, candlePoint1.y);
        browserCanvasContext.lineTo(candlePoint2.x, candlePoint2.y);
        browserCanvasContext.lineTo(candlePoint3.x, candlePoint3.y);
        browserCanvasContext.lineTo(candlePoint4.x, candlePoint4.y);

        browserCanvasContext.closePath();

        const OPACITY = '1';

        if (currentCandle.innerCandle.direction === 'up') { browserCanvasContext.strokeStyle = 'rgba(' + UI_COLOR.PATINATED_TURQUOISE + ', ' + OPACITY + ')'; }
        if (currentCandle.innerCandle.direction === 'down') { browserCanvasContext.strokeStyle = 'rgba(' + UI_COLOR.RED + ', ' + OPACITY + ')'; }
        if (currentCandle.innerCandle.direction === 'side') { browserCanvasContext.strokeStyle = 'rgba(' + UI_COLOR.DARK + ', ' + OPACITY + ')'; }

        if (currentCandle.innerCandle.direction === 'up') { browserCanvasContext.fillStyle = 'rgba(' + UI_COLOR.GREEN + ', ' + OPACITY + ')'; }
        if (currentCandle.innerCandle.direction === 'down') { browserCanvasContext.fillStyle = 'rgba(' + UI_COLOR.RUSTED_RED + ', ' + OPACITY + ')'; }
        if (currentCandle.innerCandle.direction === 'side') { browserCanvasContext.fillStyle = 'rgba(' + UI_COLOR.DARK + ', ' + OPACITY + ')'; }

        browserCanvasContext.fill();

        browserCanvasContext.lineWidth = 1;
        browserCanvasContext.stroke();


        browserCanvasContext.beginPath();

        /* put the labels with the candles values */

        


        let y;

        printLabel('High', X_AXIS, frameTitleHeight + frameBodyHeight * 0.05, '1');
        printLabel(currentCandle.innerCandle.max, X_AXIS, frameTitleHeight + frameBodyHeight * 0.10, '0.50');

        printLabel('Low', X_AXIS, frameTitleHeight + frameBodyHeight * 0.95, '1');
        printLabel(currentCandle.innerCandle.min, X_AXIS, frameTitleHeight + frameBodyHeight * 0.90, '0.50');


        y = Y_AXIS - currentCandle.bodyHeight / 2;

        if (y < frameTitleHeight + frameBodyHeight * 0.15) { y = frameTitleHeight + frameBodyHeight * 0.15; }
        if (y > frameTitleHeight + frameBodyHeight * 0.80) { y = frameTitleHeight + frameBodyHeight * 0.80; }

        printLabel('Open', X_AXIS * 1 / 2, y  , '1');
        printLabel(currentCandle.innerCandle.open, X_AXIS * 1 / 2, y + frameBodyHeight * 0.05, '0.50');

        y = Y_AXIS + currentCandle.bodyHeight / 2;

        if (y < frameTitleHeight + frameBodyHeight * 0.15) { y = frameTitleHeight + frameBodyHeight * 0.15; }
        if (y > frameTitleHeight + frameBodyHeight * 0.80) { y = frameTitleHeight + frameBodyHeight * 0.80; }

        printLabel('Close', X_AXIS * 3 / 2, y , '1');
        printLabel(currentCandle.innerCandle.close, X_AXIS * 3 / 2, y  + frameBodyHeight * 0.05, '0.50');

       

        function printLabel(labelToPrint, x, y, opacity) {

            let labelPoint;
            let fontSize = 10;

            browserCanvasContext.font = fontSize + 'px ' + UI_FONT.SECONDARY + ' Saira';

            let label = '' + labelToPrint;
            if (isNaN(label) === false) {
                label = Number(label).toLocaleString();
            }
            let xOffset = label.length / 2 * fontSize * FONT_ASPECT_RATIO;

            labelPoint = {
                x: x - xOffset,
                y: y
            };

            labelPoint = thisObject.container.frame.frameThisPoint(labelPoint);

            browserCanvasContext.fillStyle = 'rgba(' + UI_COLOR.DARK + ', ' + opacity + ')';
            browserCanvasContext.fillText(label, labelPoint.x, labelPoint.y);

        }

        browserCanvasContext.closePath();
        browserCanvasContext.fill();

    }


}

