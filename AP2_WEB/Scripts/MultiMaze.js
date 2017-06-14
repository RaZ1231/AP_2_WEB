function playerObj() {
    var pRow;
    var pCol;
}

var context;
var cellWidth;
var cellHeight;
var maze;
var myCanvas;
var exitR;
var exitC;
var startR;
var startC;

var myPlayerProp = new playerObj();
myPlayerProp.pRow = startRow;
myPlayerProp.pCol = startCol;

var opPlayerProp = new playerObj();
opPlayerProp.pRow = startRow;
opPlayerProp.pCol = startCol;


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
        context = $(this).getContext("2d");
        var rows = mazeData.length;
        var cols = mazeData[0].length;
        cellWidth = (myCanvas.width) / cols;
        cellHeight = (myCanvas.height) / rows;
        exitR = exitRow;
        exitC = exitCol;
        startR = startRow;
        startC = startCol;

        maze = mazeData;

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (maze[i][j] == 1) {
                    context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
                }
            }
        }

        var exit = exitImage;
        context.drawImage(exit, exitCol * cellWidth, exitRow * cellHeight, cellWidth, cellHeight);

        var player = playerImage;
        context.drawImage(player, startCol * cellWidth, startRow * cellHeight, cellWidth, cellHeight);

        return this;
    };
})(jQuery);
