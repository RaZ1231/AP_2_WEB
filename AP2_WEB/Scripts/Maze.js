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
    if (sessionStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else {
        $("#menuBar").load("ConnectedMenu.html");
    }
    $("#rows").val(localStorage.getItem("defaultRows"));
    $("#cols").val(localStorage.getItem("defaultCols"));
    $("#solveAlgo").val(localStorage.getItem("defaultSearch"));

    // generate
    $("#btnNewGame").click(function () {
        document.getElementById("winMessage").innerHTML = " ";
        var genRequest = {
            Name: $("#mazeName").val(),
            Rows: $("#rows").val(),
            Cols: $("#cols").val()
        }
        if (genRequest.Name != "" && genRequest.Rows > 0 && genRequest.Cols > 0) {
            document.getElementById("loader").style.display = "block";
            $.getJSON("/Maze/generate" + "/" + genRequest.Name + "/" + genRequest.Rows + "/" + genRequest.Cols)
                .done(function (jsMaze) {
                    maze = jsMaze;
                    window.document.title = maze.Name;
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
        }
    });

    // solve
    $("#btnSolve").click(function () {
        var a = $("#solveAlgo").val() == 0 ? 0 : 1;
        var request = {
            Name: maze.Name,
            Algo: a//$("#solveAlgo").val(),
        }
        $.getJSON("/Maze/solve" + "/" + request.Name + "/" + request.Algo)
            .done(function (ans) {
                //$("#sol").text(ans.Name + " : " + ans.Solution);
                solve(ans.Solution);
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

            myCanvas = $(this)[0];
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

            mazeMatrix = [];
            var arr = [];

            for (var x = 0; x < maze.Rows; x++) {
                for (var y = 0; y < maze.Cols; y++) {
                    arr.push(mazeData.charAt(x * maze.Cols + y));
                }
                mazeMatrix.push(arr);
                arr = [];
            }

            context.clearRect(0, 0, myCanvas.width, myCanvas.height);

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (mazeMatrix[i][j] == 1) {
                        context.fillStyle = "black";
                        context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
                    }
                }
            }

            var player = playerImage;
            context.drawImage(player, startCol * cellWidth, startRow * cellHeight, cellWidth, cellHeight);

            var exit = exitImage;
            context.drawImage(exit, exitCol * cellWidth, exitRow * cellHeight, cellWidth, cellHeight);

            document.getElementById("loader").style.display = "none";

            return this;
        };
    })(jQuery);

    $(document).on("keydown", keyDown);
});

function keyDown(e) {
    if (playerProp.pRow != exitR || playerProp.pCol != exitC) {
        context.fillStyle = "white";
        context.fillRect(playerProp.pCol * cellWidth, playerProp.pRow * cellHeight, cellWidth, cellHeight);
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
            if (playerProp.pCol < maze.Cols - 1) {
                if (mazeMatrix[playerProp.pRow][playerProp.pCol + 1] != 1) {
                    playerProp.pCol = playerProp.pCol + 1;
                }
            }
            break;
        case 40: // down
            if (playerProp.pRow < maze.Rows) {
                if (mazeMatrix[playerProp.pRow + 1][playerProp.pCol] != 1) {
                    playerProp.pRow = playerProp.pRow + 1;
                }
            }
            break;
        default:
            break;
    }

    context.drawImage(player, playerProp.pCol * cellWidth, playerProp.pRow * cellHeight, cellWidth, cellHeight);

    if (playerProp.pRow == exitR && playerProp.pCol == exitC) {
        document.getElementById("winMessage").innerHTML = "Congratulation!"
    }
}

function solve(solution) {
    context.fillStyle = "white";
    context.fillRect(playerProp.pCol * cellWidth, playerProp.pRow * cellHeight, cellWidth, cellHeight);
    context.drawImage(player, startC * cellWidth, startR * cellHeight, cellWidth, cellHeight);
    playerProp.pCol = startC;
    playerProp.pRow = startR;

    var solveObj = { solution: solution, i: 0, intervalID: null };
    solveObj.intervalID = setInterval(solveCallback, 600, solveObj);
}

function solveCallback(obj) {
    var i = (obj.i)++;
    if (i >= obj.solution.length) {
        clearInterval(obj.intervalID);
        return;
    }
    if (playerProp.pRow != exitR || playerProp.pCol != exitC) {
        context.fillStyle = "white";
        context.fillRect(playerProp.pCol * cellWidth, playerProp.pRow * cellHeight, cellWidth, cellHeight);
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
            if (playerProp.pCol < maze.Cols) {
                if (mazeMatrix[playerProp.pRow][playerProp.pCol + 1] != 1) {
                    playerProp.pCol = playerProp.pCol + 1;
                }
            }
            break;
        case '3': // down
            if (playerProp.pRow < maze.Rows) {
                if (mazeMatrix[playerProp.pRow + 1][playerProp.pCol] != 1) {
                    playerProp.pRow = playerProp.pRow + 1;
                }
            }
            break;
    }

    context.drawImage(player, playerProp.pCol * cellWidth, playerProp.pRow * cellHeight, cellWidth, cellHeight);

    if (playerProp.pRow == exitR && playerProp.pCol == exitC) {
        document.getElementById("winMessage").innerHTML = "Congratulation!"
    }
}