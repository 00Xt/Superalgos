﻿
function newAAMastersPlottersBollingerBandsBollingerBandsBollingerBandsPanel () {

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

    container.displacement.containerName = "Bollinger Band Panel";
    container.frame.containerName = "Bollinger Band Panel";

    let currentBand;
    let panelTabButton

    return thisObject;

    function initialize() {

        thisObject.container.frame.width = UI_PANEL.WIDTH.NORMAL;
        thisObject.container.frame.height = UI_PANEL.HEIGHT.NORMAL;

        thisObject.container.frame.position.x = viewPort.visibleArea.topRight.x - thisObject.container.frame.width * 3;
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

        if (this.container.frame.isThisPointHere(point, true) === true) {

            return this.container;

        } else {

            /* This point does not belong to this space. */

            return undefined;
        }

    }


    function onEventRaised(lastCurrentBand) {

        currentBand = lastCurrentBand;

    }


    function draw() {

        this.container.frame.draw(false, false, true);

        plotCurrentBandInfo();

        panelTabButton.draw()
    }


    function plotCurrentBandInfo() {

        if (currentBand === undefined) { return; }
        if (currentBand.innerBand === undefined) { return; }

        const frameBodyHeight = thisObject.container.frame.getBodyHeight();
        const frameTitleHeight = thisObject.container.frame.height - frameBodyHeight;

        const X_AXIS = thisObject.container.frame.width / 2;
        const Y_AXIS = frameTitleHeight + frameBodyHeight / 2;

        var bandPoint1 = {
            x: X_AXIS - currentBand.bodyWidth / 2,
            y: Y_AXIS - currentBand.leftBodyHeight / 2 - currentBand.bottomDelta / 4
        };

        var bandPoint2 = {
            x: X_AXIS - currentBand.bodyWidth / 2,
            y: Y_AXIS + currentBand.leftBodyHeight / 2 - currentBand.topDelta / 4
        };

        var bandPoint3 = {
            x: X_AXIS + currentBand.bodyWidth / 2,
            y: Y_AXIS + currentBand.rightBodyHeight / 2 + currentBand.topDelta / 4
        };

        var bandPoint4 = {
            x: X_AXIS + currentBand.bodyWidth / 2,
            y: Y_AXIS - currentBand.rightBodyHeight / 2 + currentBand.bottomDelta / 4
        };



        /* Extra bounderies due to constrained space */

        const upperLimit = frameTitleHeight + frameBodyHeight * 0.15;
        const downLimit = frameTitleHeight + frameBodyHeight * 0.85;

        if (bandPoint1.y > downLimit) { bandPoint1.y = downLimit; }
        if (bandPoint4.y > downLimit) { bandPoint4.y = downLimit; }

        if (bandPoint2.y < upperLimit) { bandPoint2.y = upperLimit; }
        if (bandPoint3.y < upperLimit) { bandPoint3.y = upperLimit; }

        bandPoint1 = thisObject.container.frame.frameThisPoint(bandPoint1);
        bandPoint2 = thisObject.container.frame.frameThisPoint(bandPoint2);
        bandPoint3 = thisObject.container.frame.frameThisPoint(bandPoint3);
        bandPoint4 = thisObject.container.frame.frameThisPoint(bandPoint4);

        browserCanvasContext.beginPath();

        browserCanvasContext.moveTo(bandPoint1.x, bandPoint1.y);
        browserCanvasContext.lineTo(bandPoint2.x, bandPoint2.y);
        browserCanvasContext.lineTo(bandPoint3.x, bandPoint3.y);
        browserCanvasContext.lineTo(bandPoint4.x, bandPoint4.y);

        browserCanvasContext.closePath();

        const OPACITY = '0.1';

        browserCanvasContext.fillStyle = 'rgba(' + UI_COLOR.PATINATED_TURQUOISE + ', ' + OPACITY + ')';

        browserCanvasContext.fill();

        browserCanvasContext.beginPath();

        browserCanvasContext.moveTo(bandPoint1.x, bandPoint1.y);
        browserCanvasContext.lineTo(bandPoint4.x, bandPoint4.y);
        browserCanvasContext.moveTo(bandPoint2.x, bandPoint2.y);
        browserCanvasContext.lineTo(bandPoint3.x, bandPoint3.y);

        browserCanvasContext.closePath();

        browserCanvasContext.strokeStyle = 'rgba(' + UI_COLOR.PATINATED_TURQUOISE + ', 1)';

        browserCanvasContext.lineWidth = 0.2;
        browserCanvasContext.stroke();

        browserCanvasContext.beginPath();

        let y1 = bandPoint1.y + (bandPoint2.y - bandPoint1.y) / 2;
        let y2 = bandPoint4.y - (bandPoint4.y - bandPoint3.y) / 2;

        browserCanvasContext.moveTo(bandPoint1.x, y1);
        browserCanvasContext.lineTo(bandPoint4.x, y2);


        browserCanvasContext.closePath();

        if (y1 > y2) {
            browserCanvasContext.strokeStyle = 'rgba(' + UI_COLOR.PATINATED_TURQUOISE + ', 1)';
        } else {
            browserCanvasContext.strokeStyle = 'rgba(' + UI_COLOR.RUSTED_RED + ', 1)';
        }

        browserCanvasContext.lineWidth = 0.2;
        browserCanvasContext.stroke();


        browserCanvasContext.beginPath();

        /* put the labels with the bands values */




        let y;

        printLabel('Moving Average', X_AXIS, frameTitleHeight + frameBodyHeight * 0.05, '1');
        printLabel(currentBand.innerBand.movingAverage, X_AXIS, frameTitleHeight + frameBodyHeight * 0.10, '0.50');

        printLabel('Deviation', X_AXIS, frameTitleHeight + frameBodyHeight * 0.95, '1');
        printLabel(currentBand.innerBand.deviation, X_AXIS, frameTitleHeight + frameBodyHeight * 0.90, '0.50');

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

