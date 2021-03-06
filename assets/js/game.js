// start countdown
let timeSpent = 0;
function startcountDown(minuts) {
    let seconds = minuts * 60;
    let interval = setInterval(() => {

        if (seconds <= 0) {
            $('.time').text(0);
            clearInterval(interval);
            // reload to play again
            location.reload();
        } else {
            $('.time').text(seconds--);
        }
    }, 1000);
}

// startcountDown(1);




// count up  timer
function startCount() {
    timer = setInterval(count, 1000);
}

function count() {
    var time_shown = $("#realtime").text();
    var time_chunks = time_shown.split(":");
    var hour, mins, secs;

    hour = Number(time_chunks[0]);
    mins = Number(time_chunks[1]);
    secs = Number(time_chunks[2]);
    secs++;
    if (secs == 60) {
        secs = 0;
        mins = mins + 1;
    }
    if (mins == 60) {
        mins = 0;
        hour = hour + 1;
    }
    if (hour == 13) {
        hour = 1;
    }
    timeSpent = hour + ":" + plz(mins) + ":" + plz(secs);
    $("#realtime").text(hour + ":" + plz(mins) + ":" + plz(secs));

}

function plz(digit) {

    var zpad = digit + '';
    if (digit < 10) {
        zpad = "0" + zpad;
    }
    return zpad;
}




// set width and height window
// var windowWidth = $(window).width();
// var windowHeight = $(window).height();
// var width = 1366;
// var height = 768;
// $(window).on('resize', function () {
//     windowWidth = $(window).width();
//     windowHeight = $(window).height();
//     if (windowHeight > windowWidth) {
//         width = 768;
//         height = 1366;
//     }
// })


// start sounds

var gameSound = new Audio('assets/sounds/gameSound.mp3');;
function startGameSound() {
    gameSound.play();
    // start countDown
    gameSound.addEventListener('ended', function () {
        this.play();
    }, false);
}

var cardSound = new Audio('assets/sounds/cardSound.mp3');
function startCardSound() {
    cardSound.play();
}



function toggleFullScreen() {
    let gamePage = document.getElementById('game-page');
    let puzzleCanvas = document.getElementById('myCanvas');
    gamePage.appendChild(puzzleCanvas);

    // if (!document.fullscreenElement) {
    //     gamePage.requestFullscreen();
    // } else {
    //     if (document.exitFullscreen) {
    //         gamePage.exitFullscreen();
    //     }
    // }


    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }


}

// Full screen

function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

iOS() ? $('#full-screen').hide() : $('#full-screen').show();










// SCALING OPTIONS
// scaling can have values as follows with full being the default
// "fit"	sets canvas and stage to dimensions and scales to fit inside window size
// "outside"	sets canvas and stage to dimensions and scales to fit outside window size
// "full"	sets stage to window size with no scaling
// "tagID"	add canvas to HTML tag of ID - set to dimensions if provided - no scaling


function startGame() {
    console.log('startGame');
    var fullScreenBtn = document.getElementById('full-screen');
    fullScreenBtn.addEventListener("click", function (e) {
        console.log('exit');
        toggleFullScreen();
    }, false);

    startGameSound();

    startCount();

    console.log('clicked');
    $('#start-page').fadeOut();
    $('#game-page').fadeIn();


    var scaling = "fit"; // this will resize to fit inside the screen dimensions
    var width = 1366;
    var height = 768;
    var countPieces = 0;
    var totalPieces = 0;
    // as of ZIM 5.5.0 you do not need to put zim before ZIM functions and classes
    var frame = new Frame(scaling, width, height);
    frame.on("ready", function () {
        zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

        var stage = frame.stage;
        var stageW = frame.width;
        var stageH = frame.height;

        var puzzleX;
        var puzzleY;
        frame.outerColor = "#000";
        frame.color = "rgba(0,0,0,0.5)";

        var con = new Container

        // with chaining - can also assign to a variable for later access
        var imageObj = [];
        var piecesArrayObj = [];
        frame.loadAssets(["puzzle-img.png"], "assets/images/");

        var label = new Label({
            text: "CLICK",
            size: 20,
            font: "courier",
            color: "orange",
            rollColor: "red",
            fontOptions: "italic bold"
        });
        // stage.addChild(label);
        // label.x = label.y = 20;
        // label.on("click", function () { zog("clicking"); });


        frame.on("complete", function () {
            console.log("completed");
            imageObj = frame.asset("puzzle-img.png").clone();
            imageObj.addTo(con);
            imageObj.alpha = 0.2;

            var piecesArray = new Array();
            var horizontalPieces = 5;
            var verticalPieces = 5;
            var obj = getQueryString();
            zog(obj)
            if (obj) {
                horizontalPieces = obj.row;
                verticalPieces = obj.column;
            }
            var imageWidth = imageObj.width;
            var imageHeight = imageObj.height;
            var pieceWidth = Math.round(imageWidth / horizontalPieces);
            var pieceHeight = Math.round(imageHeight / verticalPieces);
            var gap = 40;
            totalPieces = horizontalPieces * verticalPieces;

            puzzleX = frame.width / 2 - imageWidth / 2;
            puzzleY = frame.height / 2 - imageHeight / 2;
            imageObj.pos(puzzleX, puzzleY);
            zog(puzzleX, puzzleY);

            // label.text = "Score" + countPieces + "/" + totalPieces;


            for (j = 0; j < verticalPieces; j++) {
                piecesArrayObj[j] = [];
                for (i = 0; i < horizontalPieces; i++) {
                    var n = j + i * verticalPieces;

                    var offsetX = pieceWidth * i;
                    var offsetY = pieceHeight * j;


                    var x8 = Math.round(pieceWidth / 8);
                    var y8 = Math.round(pieceHeight / 8);

                    piecesArrayObj[j][i] = new Object();
                    piecesArrayObj[j][i].right = Math.floor(Math.random() * 2);
                    piecesArrayObj[j][i].down = Math.floor(Math.random() * 2);

                    if (j > 0) {
                        piecesArrayObj[j][i].up = 1 - piecesArrayObj[j - 1][i].down;
                    }
                    if (i > 0) {
                        piecesArrayObj[j][i].left = 1 - piecesArrayObj[j][i - 1].right;
                    }

                    piecesArray[n] = new Rectangle({
                        width: pieceWidth,
                        height: pieceHeight,

                    });



                    var tileObj = piecesArrayObj[j][i];
                    var s = new Shape

                    var context = s.graphics;
                    s.drag();
                    s.mouseChildren = false;
                    s.addEventListener("pressup", function (e) {
                        var mc = e.currentTarget;

                        var xx = Math.round(mc.x);
                        var yy = Math.round(mc.y);

                        if (xx < puzzleX + gap / 2 && xx > puzzleX - gap / 2 && yy < puzzleX + gap / 2 && yy > puzzleY - gap / 2) {
                            mc.x = puzzleX;
                            mc.y = puzzleY;
                            mc.noDrag();
                            mc.addTo(mc.parent, 0);
                            mc.mouseChildren = false;
                            mc.mouseEnabled = false;
                            mc.hint.visible = false;
                            countPieces++;
                            startCardSound();
                            $('#countPieces').text(countPieces);
                            // label.text = "Jigsaw Puzzle " + countPieces + "/" + totalPieces;
                            zog("countPieces", countPieces);
                            if (countPieces == totalPieces) {
                                storeScore(timeSpent).done(function (res) {
                                    var userId = res.user_id
                                    console.log(userId);
                                    if (res.status) {
                                        getScores().done(function (res) {
                                            if (res.status) {
                                                renderScoreLeaderBoard(res.data, userId);
                                                $('#game-page').fadeOut();
                                                $('#myCanvas').fadeOut();
                                                $('#leader-page').fadeIn();
                                                startcountDown(1);
                                            }
                                        })
                                    }
                                })
                            }
                            stage.update();

                        }

                    });
                    context.setStrokeStyle(3, "round");
                    var commandi1 = context.beginStroke(createjs.Graphics.getRGB(0, 0, 0)).command;
                    //
                    var commandi = context.beginBitmapFill(imageObj.image).command;


                    context.moveTo(offsetX, offsetY);




                    if (j != 0) {
                        context.lineTo(offsetX + 3 * x8, offsetY);
                        if (tileObj.up == 1) {
                            context.curveTo(offsetX + 2 * x8, offsetY - 2 * y8, offsetX + 4 * x8, offsetY - 2 * y8);
                            context.curveTo(offsetX + 6 * x8, offsetY - 2 * y8, offsetX + 5 * x8, offsetY);
                        } else {
                            context.curveTo(offsetX + 2 * x8, offsetY + 2 * y8, offsetX + 4 * x8, offsetY + 2 * y8);
                            context.curveTo(offsetX + 6 * x8, offsetY + 2 * y8, offsetX + 5 * x8, offsetY);
                        }
                    }
                    context.lineTo(offsetX + 8 * x8, offsetY);
                    if (i != horizontalPieces - 1) {
                        context.lineTo(offsetX + 8 * x8, offsetY + 3 * y8);
                        if (tileObj.right == 1) {
                            context.curveTo(offsetX + 10 * x8, offsetY + 2 * y8, offsetX + 10 * x8, offsetY + 4 * y8);
                            context.curveTo(offsetX + 10 * x8, offsetY + 6 * y8, offsetX + 8 * x8, offsetY + 5 * y8);
                        } else {
                            context.curveTo(offsetX + 6 * x8, offsetY + 2 * y8, offsetX + 6 * x8, offsetY + 4 * y8);
                            context.curveTo(offsetX + 6 * x8, offsetY + 6 * y8, offsetX + 8 * x8, offsetY + 5 * y8);
                        }
                    }
                    context.lineTo(offsetX + 8 * x8, offsetY + 8 * y8);
                    if (j != verticalPieces - 1) {
                        context.lineTo(offsetX + 5 * x8, offsetY + 8 * y8);
                        if (tileObj.down == 1) {
                            context.curveTo(offsetX + 6 * x8, offsetY + 10 * y8, offsetX + 4 * x8, offsetY + 10 * y8);
                            context.curveTo(offsetX + 2 * x8, offsetY + 10 * y8, offsetX + 3 * x8, offsetY + 8 * y8);
                        } else {
                            context.curveTo(offsetX + 6 * x8, offsetY + 6 * y8, offsetX + 4 * x8, offsetY + 6 * y8);
                            context.curveTo(offsetX + 2 * x8, offsetY + 6 * y8, offsetX + 3 * x8, offsetY + 8 * y8);
                        }
                    }
                    context.lineTo(offsetX, offsetY + 8 * y8);
                    if (i != 0) {
                        context.lineTo(offsetX, offsetY + 5 * y8);
                        if (tileObj.left == 1) {
                            context.curveTo(offsetX - 2 * x8, offsetY + 6 * y8, offsetX - 2 * x8, offsetY + 4 * y8);
                            context.curveTo(offsetX - 2 * x8, offsetY + 2 * y8, offsetX, offsetY + 3 * y8);
                        } else {
                            context.curveTo(offsetX + 2 * x8, offsetY + 6 * y8, offsetX + 2 * x8, offsetY + 4 * y8);
                            context.curveTo(offsetX + 2 * x8, offsetY + 2 * y8, offsetX, offsetY + 3 * y8);
                        }
                    }
                    context.lineTo(offsetX, offsetY);
                    s.addTo(con);

                    var fill = new createjs.Graphics.Fill("red");

                    //var newGra = context.append(fill);
                    var hint = new Shape();//s.clone(true);
                    hint.mouseChildren = false;
                    hint.mouseEnabled = false;
                    s.hint = hint;
                    hint.graphics = context.clone(true);
                    hint.pos(puzzleX, puzzleY);
                    // newGra.graphics = newGra;
                    hint.graphics._fill = fill;
                    hint.graphics._fill.style = null;

                    hint.addTo(con, 0);
                    //s.animate({obj:{x:frame.width-offsetX-pieceWidth,y:frame.height-offsetY-pieceHeight}, time:700});
                    //s.animate({obj:{x:-offsetX,y:-offsetY}, time:700});
                    s.animate({ obj: { x: rand(-offsetX, frame.width - offsetX - pieceWidth), y: rand(-offsetY, frame.height - offsetY - pieceHeight) }, time: 700 });

                }
            }


            con.addTo(stage);
            /*con.x -= imageWidth/2;
            con.y -= imageHeight/2;*/
            stage.update();

            iOS() ? $('#full-screen').hide() : toggleFullScreen();



        }); // end asset complete


        stage.update(); // this is needed to show any changes

    }); // end of ready 
}

