var context;
var cellWidth;
var cellHeight;
var maze;
var pRow;
var pCol;
var playerImg;

(function ($) {
    $.fn.mazeBoard = function (
        mazeData,
        startRow, startCol,
        exitRow, exitCol,
        playerImage,
        exitImage,
        enabled,
        moveFunction
    ) {

        var myCanvas = $(this);
        context = mazeCanvas.getContext("2d");
        var rows = mazeData.length; var cols = mazeData[0].length;
        cellWidth = mazeCanvas.width / cols;
        cellHeight = mazeCanvas.height / rows;
        maze = mazeData;
        var x = 0;
        var y = 0;
        pRow = startRow;
        pCol = startCol;

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (mazeData[i][j] == 1) {
                    context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
                }
            }
        }

        var exit = exitImage;
        context.drawImage(exit, exitCol * cellWidth, exitRow * cellHeight, cellWidth, cellHeight);

        var player = playerImage;
        
        playerImg = new Image();
        playerImg.src = "/Resources/mario.jpg";
        playerImg.style.position = absolute;
        var topPX = startRow * cellHeight + 'px';
        var leftPX = startCol * cellWidth + 'px';
        playerImg.style.top = topPX;
        playerImg.style.left = leftPX;
        context.drawImage(player, startCol * cellWidth, startRow * cellHeight, cellWidth, cellHeight);

        var enterence = document.getElementById("enterence");
        enterence.src = "/Resources/door.jpg";

        return this;
    };
})(jQuery);


function keydown(e) {
    switch (e.which) {
        case 37:
            move("left", pRow, pCol);
            break;
        case 38:
            move("up", pRow, pCol);
            break;
        case 39:
            move("right", pRow, pCol);
            alert("woohoo");
            break;
        case 40:
            move("down", pRow, pCol);
            break;
    }
}

function move(direction, playerRow, playerCol) {
    player.hide();
    switch (direction) {
        case "left":
            if (playerCol > 0) {
                if (mazeData[playerRow][playerCol - 1] != '1') {
                    //playerCol = playerCol - 1;
                    var element = document.getElementById("player");
                    element.style.left = parseInt(element.style.left) - cellWidth + 'px';
                }
            }
            break;
        case "up":
            if (playerRow > 0) {
                if (mazeData[playerRow - 1][playerCol] != '1') {
                    //playerRow = playerRow - 1;
                    var element = document.getElementById("player");
                    element.style.top = parseInt(element.style.top) - cellHeight + 'px';
                }
            }
            break;
        case "right":
            if (playerCol < mazeData[0].length) {
                if (mazeData[playerRow][playerCol + 1] != '1') {
                    //playerCol = playerCol + 1;
                    var element = document.getElementById("player");
                    element.style.left = parseInt(element.style.left) + cellWidth + 'px';
                    alert("woohoo");
                }
            }
            break;
        case "down":
            if (playerCol < mazeData[0].length) {
                if (mazeData[playerRow + 1][playerCol] != '1') {
                    //playerRow = playerRow + 1;
                    var element = document.getElementById("player");
                    element.style.top = parseInt(element.style.top) + cellHeight + 'px';
                }
            }
            break;
    }
    //context.drawImage(player, playerCol * cellHeight, playerRow * cellWidth, cellWidth, cellHeight);
}

var mazeData = [[0, 1, 0, 1, 0, 1],
['#', 0, 0, 1, 1, 0],
[0, 1, 0, 0, 0, 0],
[0, 1, 0, 1, 1, 1],
[0, 1, 0, 0, 0, 0],
[1, 1, 0, '*', 1, 0],
[0, 0, 0, 0, 0, 1]];

var startRow = 1;
var startCol = 0;
var exitRow = 5;
var exitCol = 3
var playerImage = document.getElementById("player");
var exitImage = document.getElementById("exit");
var enabled = true;
var moveFunction = undefined;



