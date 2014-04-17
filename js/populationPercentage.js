// startup vars
var ppappHeight = 950,
    ppappWidth = 1106,
    plotName = "Global";

// wrapper for our "classes", "methods" and "objects"
window.PPViewer = {};

// plot selector
var select = document.createElement('select');
select.setAttribute('id','plotSelect');

var plotNames = ["Global","Africa","Europe","West Asia","South and Central Asia","East and North Asia","Hispanic-Afro-Caribbean-Native American"];

for (var i = 0; i < plotNames.length; i++) {

    var opt = document.createElement('option');
    opt.value = plotNames[i];
    opt.innerHTML = plotNames[i];
    select.appendChild(opt);

}

document.getElementById("PPSelect").appendChild(select);

select.addEventListener('change', function() {

    if (document.getElementById("drawCanvas")) {
        var element = document.getElementById("drawCanvas");
        element.parentNode.removeChild(element);
    }
    plotName = select.value;
    PPViewer.loadInit()

});

//loader
(function(){

    var plotItems = [], dataload;

    function Loader() {


    }

    Loader.prototype.loadData = function() {

        // mapItems stuff
        dataload = false;

        $.getJSON('https://api.moffpart.com/api/1/results/getHaplogroup?q={"title":"'+ plotName + '"}&c=populationPercentageReference&callback=?', function(ret) {

            plotItems = ret[0];
            parseData();

        });

        // preloader graphics
        var prossElement = document.createElement('div'),
            dialogElement = document.createElement('div'),
            spinElement = document.createElement('div'),
            paraElement = document.createElement('p'),
            textItem = document.createTextNode("Loading plotItems…");

        prossElement.setAttribute('id', "Processing");
        prossElement.setAttribute('Style', "height:" + ppappHeight + "px; width:" + ppappWidth + "px;");
        dialogElement.setAttribute('class','dialog');
        spinElement.setAttribute('class','spinner-container');

        paraElement.appendChild(textItem);
        dialogElement.appendChild(paraElement);
        dialogElement.appendChild(spinElement);
        prossElement.appendChild(dialogElement);
        document.getElementById("canvasPopulationPercentage").appendChild(prossElement);
        $('#Processing').show();
    };

    function parseData() {

        dataload = true;
    }

    Loader.prototype.loadStatus = function() {

        return dataload
    };

    Loader.prototype.returnData = function() {

        allData = {
            plotItems:plotItems
        };
        return allData
    };

    PPViewer.Loader = Loader;

})();

// artboard
(function(){

    // zoom params
    var zoomRatio = 1, appmiddle = ppappWidth/ 2 - 65.5, sliderX = appmiddle, centreContainer, startx;

    // data
    var drawItemsData;

    // interaction
    var interactionObject, feedback;

    //plot num
    var currentPlot = 0;

    function Artboard(){

        interactionObject = {
            state:0,
            data:"Nil"
        };

        feedback = {


        }
    }

    Artboard.prototype.setAssets = function () {


    };

    Artboard.prototype.dataLoad = function (data){

        drawItemsData  = data.plotItems;
        //console.log(drawItemsData)

    };

    Artboard.prototype.zoom = function (user){

        currentPlot = user.plot;
        var newx = user.mapX + startx;
        if (newx % 1 == 0) {newx += 0.5}
        centreContainer.x = newx;
    };

    Artboard.prototype.background = function (displayObject){

        // area to add stuff ----->

        centreContainer = new createjs.Container();

        var plotItems = [];
        plotItems =  drawItemsData.traceArray;
        var colors = [];
        colors = drawItemsData.colors;

        var numItems = drawItemsData.items,
            klength = drawItemsData.klength,
            endx = startx + klength;

        startx = -numItems/2 + 553;

        if (startx % 1 == 0) {startx += 0.5}

        centreContainer.x = startx + 0.5;
        centreContainer.y = 435.5;
        displayObject.addChild(centreContainer);

        var linesnshit = new createjs.Shape();
        linesnshit.graphics.beginStroke("#333");
        linesnshit.graphics.setStrokeStyle(1);
        linesnshit.graphics.moveTo(0, -6);
        linesnshit.graphics.lineTo(numItems -1, -6);
        linesnshit.graphics.moveTo(0, 306);
        linesnshit.graphics.lineTo(numItems -1, 306);
        centreContainer.addChild(linesnshit);

        var smallxpos = 0,
            smallypos = 300;

        for (var i = 0; i < numItems; i++) {
            var section = plotItems[i];

            var plotItem = new createjs.Shape();
            for (var j = 0; j < klength; j++) {

                var height = section["K" + (j+1)]*300;
                plotItem.graphics.beginFill(colors[j]).drawRect(smallxpos,smallypos,1,-height);
                smallypos = smallypos-height;

            }
            centreContainer.addChild(plotItem);

            if (section.topGraphic !== "null") {

                linesnshit.graphics.moveTo(smallxpos, -6);
                linesnshit.graphics.lineTo(smallxpos, -14);

                var topText = new createjs.Text(section.topGraphic, "18px Petrona", "#666");
                topText.x = smallxpos - 8;
                topText.y = -20;
                topText.rotation = 270;
                centreContainer.addChild(topText)
            }

            if (section.bottomGraphic !== "null") {

                if (section.bottomGraphic === "tick") {

                    linesnshit.graphics.moveTo(smallxpos, 306);
                    linesnshit.graphics.lineTo(smallxpos, 312);

                } else {

                    var botText = new createjs.Text(section.bottomGraphic, "12px Petrona", "#000");
                    botText.x = smallxpos - 7;
                    botText.y = 313;
                    botText.rotation = 270;
                    botText.textAlign = "right";
                    centreContainer.addChild(botText)

                }

            }

            smallypos = 300;
            smallxpos ++;
        }

        linesnshit.shadow = new createjs.Shadow("#999", 4, 4, 8);

        var textItems = drawItemsData.textArray,
            numText = drawItemsData.textArray.length;

        var wrapperElement = document.createElement('div');
        wrapperElement.setAttribute('id','plotDescription');
        wrapperElement.setAttribute('class','result-block-description');

        for (var k = 0; k < numText; k++) {

            if (k % 2 === 0) {

                var titleElement = document.createElement('h3'),
                    titleItem = document.createTextNode(textItems[k].title);

                titleElement.appendChild(titleItem);
                wrapperElement.appendChild(titleElement);

            } else {

                var paraElement = document.createElement('p'),
                    bodyItem = document.createTextNode(textItems[k].body);

                paraElement.appendChild(bodyItem);
                wrapperElement.appendChild(paraElement);
            }
        }

        if (document.getElementById("plotDescription")) {
            var element = document.getElementById("plotDescription");
            element.parentNode.removeChild(element);
        }

        var newElement = document.getElementById("canvasPopulationPercentage");
        newElement.appendChild(wrapperElement);

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.redraw = function (displayObject){

        // area to add stuff ----->
        /*var sliderContainer = new createjs.Container();
        sliderContainer.y = 680;
        sliderContainer.x = 64;
        displayObject.addChild(sliderContainer);


        var sliderGrip = new createjs.Shape();
        //sliderGrip.graphics.beginLinearGradientFill(["#575756","#878787"], [0,.8], appmiddle, 237, appmiddle, 270).drawRoundRect(sliderX - 11,230,14,32,8);
        sliderGrip.graphics.beginFill("#575756").drawRoundRect(sliderX - 11,230,14,32,8);
        sliderGrip.shadow = new createjs.Shadow("#aaa", 1, 1, 3);
        sliderContainer.addChild(sliderGrip);

        var lowLimit = 411,
            highLimit = 683;

        sliderContainer.on("pressmove", function(evt) {

            console.log(evt.stageX)

            if (evt.stageX > lowLimit && evt.stageX < highLimit) {
                sliderX = evt.stageX - 70;

                centreContainer.x = 100* sliderX
            }
        });*/

        // <------ area to add stuff
    };

    Artboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->

        var currentResult = customerItems[plotName],
            klength = drawItemsData.klength,
            colors = drawItemsData.colors,
            smallypos = 330,
            gap = 380/klength - 7,
            totalHeight = 330,
            keyy = 50;

        var keyBackground = new createjs.Container();
        keyBackground.x = 0.5;
        keyBackground.y = 0.5;
        displayObject.addChild(keyBackground);

        // Customer display

         if (currentResult) {

             keyBackground.x = 0.5;

             var dataShape = new createjs.Shape();
             dataShape.graphics.setStrokeStyle(1).beginStroke("#bbb").drawRect(356,24,500,312);
             dataShape.graphics.beginStroke("#666").beginFill("#FFF").drawRect(350,18,512,324);
             dataShape.graphics.setStrokeStyle(1).beginStroke("#bbb").drawRect(26,24,272,126);
             dataShape.graphics.beginStroke("#666").beginFill("#FFF").drawRect(20,18,284,138);
             dataShape.alpha = 0.75;
             keyBackground.addChild(dataShape);

             var custName = new createjs.Text("Your Population Percentage plot shows\nthe percentage " +
                 "of your genome from\neach different ancestry cluster.","15px Petrona","#333");
             custName.lineHeight = 18;
             custName.x = 29;
             custName.y = 28;
             keyBackground.addChild(custName);

             var details = new createjs.Text("What is your largest ancestry component?\nCompare yourself to the individuals below\nto see who " +
                 "you are most similar to.","15px Petrona","#333");
             details.lineHeight = 18;
             details.x = 29;
             details.y = 90;
             keyBackground.addChild(details);


             dataShape.shadow = new createjs.Shadow("#ccc", 2, 2, 4);

             if (klength === 11) {gap = 28}
             if (klength === 6) {gap = 54}
             if (klength === 8) {gap = 39}
             if (klength === 7) {gap = 46}
             if (klength === 5) {gap = 67}

             for (var i = 0; i < klength; i++) {

                 var keypos = 310 - i*gap;

                 var KeyName = new createjs.Text(drawItemsData.titleArray[i],"15px Petrona","#333");
                 KeyName.x = 600;
                 KeyName.y = keypos;
                 keyBackground.addChild(KeyName);

                 var keyShape = new createjs.Shape();
                 keyShape.graphics.beginFill(drawItemsData.colors[i]).beginStroke("#FFF").setStrokeStyle(1).drawRect(790,keypos - 3,22,22);
                 keyBackground.addChild(keyShape);
                 keyShape.shadow = new createjs.Shadow("#ccc", 2, 2, 4);

                 var inHeight = currentResult[i]*300;

                 var linesnshit = new createjs.Shape();
                 linesnshit.graphics.beginStroke("#000");
                 linesnshit.graphics.setStrokeStyle(0.5,"round");
                 linesnshit.graphics.moveTo(592, keypos + 10);
                 linesnshit.graphics.lineTo(540, keypos + 10);
                 linesnshit.graphics.moveTo(500, keypos + 10);
                 linesnshit.graphics.lineTo(480, keypos + 10);
                 linesnshit.graphics.lineTo(426, totalHeight - inHeight/2);
                 keyBackground.addChild(linesnshit);

                 var perc = Math.round(currentResult[i]*100);
                 var percent = new createjs.Text(perc + "%","15px Petrona","#333");
                 percent.x = 510;
                 percent.y = keypos;
                 keyBackground.addChild(percent);

                 totalHeight = totalHeight - inHeight;
             }

             var plotItem = new createjs.Shape();
             for (var j = 0; j < klength; j++) {

                 var height = currentResult[j]*300;
                 plotItem.graphics.beginFill(colors[j]).drawRect(400,smallypos,20,-height);
                 smallypos = smallypos-height;

                 plotItem.shadow = new createjs.Shadow("#999", 2, 2, 4);
             }

             keyBackground.addChild(plotItem);

         } else {

             keyBackground.x = 0.5;

             var normShape = new createjs.Shape();
             normShape.graphics.setStrokeStyle(1).beginStroke("#bbb").drawRect(ppappWidth - 224,keyy,210,(klength*30)+3);
             normShape.graphics.beginStroke("#666").beginFill("#FFF").drawRect(ppappWidth - 230,keyy-6,222,(klength*30)+15);
             normShape.graphics.setStrokeStyle(1).beginStroke("#bbb").drawRect(26,24,240,50);
             normShape.graphics.beginStroke("#666").beginFill("#FFF").drawRect(20,18,252,62);
             normShape.alpha = 0.75;
             keyBackground.addChild(normShape);

             normShape.shadow = new createjs.Shadow("#ccc", 2, 2, 4);

             drawItemsData.titleArray.reverse();
             drawItemsData.colors.reverse();

             for (var k = 0; k < klength; k++) {

                 var keyypos = keyy + 8 + k*30;

                 var NormName = new createjs.Text(drawItemsData.titleArray[k],"15px Petrona","#333");
                 NormName.x = ppappWidth - 220;
                 NormName.y = keyypos;
                 keyBackground.addChild(NormName);

                 var normSquare = new createjs.Shape();
                 normSquare.graphics.beginFill(drawItemsData.colors[k]).beginStroke("#FFF").setStrokeStyle(1).drawRect(ppappWidth - 40,keyypos - 3,22,22);
                 keyBackground.addChild(normSquare);
                 normSquare.shadow = new createjs.Shadow("#ccc", 2, 2, 4);

             }

             var notOnPlot = new createjs.Text("You do not fit within the genetic\nvariability shown in this plot.","16px Petrona","#333");
             notOnPlot.x = 34;
             notOnPlot.y = 32;
             keyBackground.addChild(notOnPlot);
         }

        if (plotName === "Global") {

            var bigPlotNote = new createjs.Text("There are over 3800 individuals on this plot. We have centered it on Europe, to see the " +
                "full plot drag it left and right with your mouse.","12px Petrona","#333");
            bigPlotNote.x = 16;
            bigPlotNote.y = 912;
            keyBackground.addChild(bigPlotNote);

        }

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Artboard.prototype.interaction = function(){

        return interactionObject
    };

    Artboard.prototype.resetInteraction = function(){

        interactionObject.state = 0;
        interactionObject.data = "Nil";
    };

    PPViewer.Artboard = Artboard;

})();

// dashboard
(function(){

    var user, plotdata;

    function Dashboard() {

        user = {
            render:false,
            mapX:0
        };
    }

    Dashboard.prototype.controlData = function(data) {

        plotdata = data.plotItems;
    };

    Dashboard.prototype.background = function(displayObject) {

        // area to add stuff ----->


        // <------ area to add stuff

        displayObject.updateCache("source-overlay");
    };

    Dashboard.prototype.redraw = function(displayObject) {

        // area to add stuff ----->



        // <------ area to add stuff
    };

    Dashboard.prototype.eventlayer = function (displayObject){

        // area to add stuff ----->

        var numItems = plotdata.items,
            startx = -numItems/2 + 570,
            endx = startx + numItems;

        // pan base
        var panSliderbase = new createjs.Shape();
        panSliderbase.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#F00").drawRect(startx,352,numItems,500));
        panSliderbase.alpha = 0.5;
        //panSliderbase.x = user.xoffset;
        //panSliderbase.y = user.yoffset;
        displayObject.addChild(panSliderbase);

        var xdif, ydif, o;

        panSliderbase.on("mousedown", function(evt) {

            o = evt.target;
            o.offset = {x:o.x-evt.stageX, y:o.y-evt.stageY};
            user.render = true;
        });

        panSliderbase.on("pressmove", function(evt) {

            panSliderbase.x = evt.stageX + o.offset.x;
            user.mapX = evt.stageX + o.offset.x;

        });

        panSliderbase.on("pressup", function(evt) {

            user.render = false;
        });

        // <------ area to add stuff

        displayObject.updateCache("source-overlay");

    };

    Dashboard.prototype.userFeedback = function() {

        return user;
    };

    PPViewer.Dashboard = Dashboard;

})();

// highlight
(function(){

    var interactionObject, viewInteraction;

    function Highlight() {

        interactionObject = {
            state:"inactive",
            data:"Nil"
        };
    }

    Highlight.prototype.dataLoad = function(viewData) {

        viewInteraction = viewData;
    };

    Highlight.prototype.background = function(displayObject) {


    };

    Highlight.prototype.redraw = function(displayObject) {


    };

    Highlight.prototype.eventlayer = function(displayObject) {


    };

    Highlight.prototype.currentState = function() {

        return interactionObject
    };

    Highlight.prototype.resetInteraction = function(){

        interactionObject.state = "inactive";
        interactionObject.data = "Nil";
    };

    PPViewer.Highlight = Highlight;

})();

// renderer
(function(){

    var stats, canvas, stage, view, control, highlight,
        artboard, artboardBackground, artboardRedraw, artboardEventArea,
        dashboardRedraw, dashboardBackground, dashboardEventArea,
        highlightContainer, highlightBackground, highlightRedraw, highlightEventArea,
        loader, loadStatus;

    PPViewer.loadInit = function(){

        /*stats = new Stats();
         $('.block').prepend(stats.domElement);*/

        // prepare the view
        view = new PPViewer.Artboard(ppappWidth,ppappHeight);

        // prepare the highlight
        highlight = new PPViewer.Highlight();

        // prepare the dashboard
        control = new PPViewer.Dashboard();

        // wdloader init
        loader = new PPViewer.Loader();
        loadStatus = false;
        loader.loadData();

        TweenMax.ticker.addEventListener("tick", loadRequest);
    };

    function init() {

        // prepare our canvas
        canvas = document.createElement( 'canvas' );
        canvas.setAttribute('id','drawCanvas');
        canvas.width = ppappWidth;
        canvas.height = ppappHeight;
        document.getElementById("canvasPopulationPercentage").appendChild(canvas);

        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        // artboard
        artboard = new createjs.Container();
        //artboard.y = 20;
        stage.addChild(artboard);

        artboardBackground = new createjs.Container();
        artboardBackground.cache(0, 0, ppappWidth, ppappHeight);
        artboard.addChild(artboardBackground);
        view.background(artboardBackground);

        artboardRedraw = new createjs.Container();
        artboard.addChild(artboardRedraw);

        artboardEventArea = new createjs.Container();
        artboardEventArea.cache(0, 0, ppappWidth, ppappHeight);
        artboard.addChild(artboardEventArea);
        view.eventlayer(artboardEventArea);

        // dashboard
        dashboardBackground = new createjs.Container();
        dashboardBackground.cache(0, 0, ppappWidth, ppappHeight);
        stage.addChild(dashboardBackground);
        control.background(dashboardBackground);

        dashboardEventArea = new createjs.Container();
        dashboardEventArea.cache(0, 0, ppappWidth, ppappHeight);
        stage.addChild(dashboardEventArea);
        control.eventlayer(dashboardEventArea);

        dashboardRedraw  = new createjs.Container();
        stage.addChild(dashboardRedraw);

        // highlight
        highlightContainer = new createjs.Container();
        highlightContainer.y = 20;
        stage.addChild(highlightContainer);

        highlightBackground = new createjs.Container();
        highlightBackground.cache(0, 0, ppappWidth, ppappHeight);
        highlightContainer.addChild(highlightBackground);

        highlightRedraw  = new createjs.Container();
        stage.addChild(highlightRedraw);

        highlightEventArea = new createjs.Container();
        highlightEventArea.cache(0, 0, ppappWidth, ppappHeight);
        highlightContainer.addChild(highlightEventArea);

        TweenMax.ticker.addEventListener("tick", frameRender);
    }

    function loadRequest() {

        var loadFinished = loader.loadStatus();
        if (loadFinished) {
            loadStatus = true;
            var data = loader.returnData();
            view.dataLoad(data);
            control.controlData(data);
            removeLoader()
        }
    }

    function removeLoader() {

        $('#Processing').remove();
        TweenMax.ticker.removeEventListener("tick", loadRequest);
        init();
    }

    function frameRender() {

        //stats.begin();

        artboardRedraw.removeAllChildren();
        highlightRedraw.removeAllChildren();
        dashboardRedraw.removeAllChildren();

        view.redraw(artboardRedraw);
        highlight.redraw(highlightRedraw);
        control.redraw(dashboardRedraw);

        var viewData = view.interaction();

        if (viewData.state === "openhighlight") {
            highlight.dataLoad(viewData);
            highlight.eventlayer(highlightEventArea);
            highlight.background(highlightBackground);
            view.resetInteraction()
        }

        var user = control.userFeedback();
        if (user.render) {

            artboardBackground.updateCache();
            dashboardEventArea.updateCache();
        }

        view.zoom(control.userFeedback());

        var highlightData = highlight.currentState();

        if (highlightData.state === "closehighlight") {
            highlightBackground.removeAllChildren();
            highlightBackground.updateCache();

            highlightEventArea.removeAllChildren();
            highlightEventArea.updateCache();

            highlight.resetInteraction()
        }

        // update stage
        stage.update();

        //stats.end();
    }

})();

var resultid = document.getElementById("canvasPopulationPercentage").getAttribute("data-population-percentage-id");

$.getJSON('https://api.moffpart.com/api/1/results/getAMAResults/'+ resultid +'?c=amaPopulationPercentage&callback=?', function(ret) {

    customerItems = ret;

    console.log(customerItems)

});

//Init
PPViewer.loadInit();

// utils

//sorts array by key
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var
            x = +a[key],

            y = +b[key];

        // console.log(x)

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


