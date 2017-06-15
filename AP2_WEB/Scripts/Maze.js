function playerObj() {
    var pRow;
    var pCol;
}

var context;
var cellWidth;
var cellHeight;
var maze;
var mazeMatrix;
var playerProp;
var myCanvas;
var exitR;
var exitC;
var startR;
var startC;

$(document).ready(function () {

    // generate
    $("#btnNewGame").click(function () {
        var genRequest = {
            Name: $("#mazeName").val(),
            Rows: $("#rows").val(),
            Cols: $("#cols").val()
        }
        $.getJSON("/Maze/generate" + "/" + genRequest.Name + "/" + genRequest.Rows + "/" + genRequest.Cols)
            .done(function (jsMaze) {
                maze = jsMaze;
                $("#product").text(maze.Name + " : " + maze.Maze);
                $("#mazeCanvas").mazeBoard(
       maze.Maze, // the matrix containing the maze cells
       maze.Start.Row,
       maze.Start.Col, // initial position of the player
       maze.End.Row,
       maze.End.Col, // the exit position 
       document.getElementById("player"), // player's icon (of type Image)
       document.getElementById("exit"), // exit icon
       true,
       undefined
        );
            })
    });

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

            myCanvas = document.getElementById("mazeCanvas");
            context = myCanvas.getContext("2d");
            var rows = maze.Rows;
            var cols = maze.Cols;
            cellWidth = (myCanvas.width) / cols;
            cellHeight = (myCanvas.height) / rows;
            exitR = exitRow;
            exitC = exitCol;
            startR = startRow;
            startC = startCol;      

            playerProp = new playerObj();
            playerProp.pRow = startRow;
            playerProp.pCol = startCol;



            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (mazeMatrix[i][j] == 1) {
                        context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
                    }
                }
            }

            var player = playerImage;
            context.drawImage(player, startCol * cellWidth, startRow * cellHeight, cellWidth, cellHeight);

            var exit = exitImage;
            context.drawImage(exit, exitCol * cellWidth, exitRow * cellHeight, cellWidth, cellHeight);

            return this;
        };
    })(jQuery);

    document.addEventListener("keydown", keydown, false);
});

function keydown(e) {
    if (playerProp.pRow != exitR || playerProp.pCol != exitC) {
        context.fillStyle = "white";
        context.fillRect(playerProp.pCol * cellHeight, playerProp.pRow * cellWidth, cellWidth, cellHeight);
    } else {
        var exit = document.getElementById("exit");
        context.drawImage(exit, exitC * cellWidth, exitR * cellHeight, cellWidth, cellHeight);
    }

    switch (e.which) {
        case 37: // left
            if (playerProp.pCol > 0) {
                if (mazeMatrix[playerProp.pRow][playerProp.pCol - 1] != 1) {
                    playerProp.pCol = playerProp.pCol - 1;
                }
            }
            break;
        case 38: //up
            if (playerProp.pRow > 0) {
                if (mazeMatrix[playerProp.pRow - 1][playerProp.pCol] != 1) {
                    playerProp.pRow = playerProp.pRow - 1;
                }
            }
            break;
        case 39: // right
            if (playerProp.pCol < maze[0].length - 1) {
                if (mazeMatrix[playerProp.pRow][playerProp.pCol + 1] != 1) {
                    playerProp.pCol = playerProp.pCol + 1;
                }
            }
            break;
        case 40: // down
            if (playerProp.pRow < maze[0].length - 1) {
                if (mazeMatrix[playerProp.pRow + 1][playerProp.pCol] != 1) {
                    playerProp.pRow = playerProp.pRow + 1;
                }
            }
            break;
    }

    context.drawImage(player, playerProp.pCol * cellHeight, playerProp.pRow * cellWidth, cellWidth, cellHeight);

    if (playerProp.pRow == exitR && playerProp.pCol == exitC) {
        alert("Yay!");
    }
}

function solve(solution) {
    context.fillStyle = "white";
    context.fillRect(playerProp.pCol * cellHeight, playerProp.pRow * cellWidth, cellWidth, cellHeight);
    context.drawImage(player, startC * cellWidth, startR * cellHeight, cellWidth, cellHeight);
    playerProp.pCol = startC;
    playerProp.pRow = startR;

    var sol = "11333333331";
    solution = sol;
    var solveObj = { solution: solution, i: 0, intervalID: null };
    solveObj.intervalID = setInterval(solveCallback, 1000, solveObj);
}

function solveCallback(obj) {
    var i = (obj.i)++;
    if (i >= obj.solution.length) {
        clearInterval(obj.intervalID);
        return;
    }
    if (playerProp.pRow != exitR || playerProp.pCol != exitC) {
        context.fillStyle = "white";
        context.fillRect(playerProp.pCol * cellHeight, playerProp.pRow * cellWidth, cellWidth, cellHeight);
    } else {
        var exit = document.getElementById("exit");
        context.drawImage(exit, exitC * cellWidth, exitR * cellHeight, cellWidth, cellHeight);
    }

    switch (obj.solution[i]) {
        case '0': // left
            if (playerProp.pCol > 0) {
                if (mazeMatrix[playerProp.pRow][playerProp.pCol - 1] != 1) {
                    playerProp.pCol = playerProp.pCol - 1;
                }
            }
            break;
        case '2': //up
            if (playerProp.pRow > 0) {
                if (mazeMatrix[playerProp.pRow - 1][playerProp.pCol] != 1) {
                    playerProp.pRow = playerProp.pRow - 1;
                }
            }
            break;
        case '1': // right
            if (playerProp.pCol < mazeMatrix[0].length - 1) {
                if (mazeMatrix[playerProp.pRow][playerProp.pCol + 1] != 1) {
                    playerProp.pCol = playerProp.pCol + 1;
                }
            }
            break;
        case '3': // down
            if (playerProp.pRow < mazeMatrix[0].length) {
                if (mazeMatrix[playerProp.pRow + 1][playerProp.pCol] != 1) {
                    playerProp.pRow = playerProp.pRow + 1;
                }
            }
            break;
    }

    context.drawImage(player, playerProp.pCol * cellHeight, playerProp.pRow * cellWidth, cellWidth, cellHeight);

    if (playerProp.pRow == exitR && playerProp.pCol == exitC) {
        alert("Yay!");
    }
}


