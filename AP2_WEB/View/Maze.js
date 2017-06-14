function playerObj() {
    var pRow;
    var pCol;
}

var context;
var cellWidth;
var cellHeight;
var maze;
var playerProp;
var myCanvas;
var exitR;
var exitC;

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
        var rows = mazeData.length;
        var cols = mazeData[0].length;
        cellWidth = 50;// Math.floor((myCanvas.width) / cols);
        cellHeight = 50;// Math.floor((myCanvas.height) / rows);
        exitR = exitRow;
        exitC = exitCol;
        maze = mazeData;

        playerProp = new playerObj();
        playerProp.pRow = startRow;
        playerProp.pCol = startCol;

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

        var enterence = document.getElementById("enterence");
        //enterence.src = "/Resources/door.jpg";

        return this;
    };
})(jQuery);


function keydown(e) {
    if(playerProp.pRow != exitR || playerProp.pCol != exitC) {
        context.fillStyle = "white";
        context.fillRect(playerProp.pCol * cellHeight, playerProp.pRow * cellWidth, cellWidth, cellHeight);
    } else {
        var exit = document.getElementById("exit");
        context.drawImage(exit, exitC * cellWidth, exitR * cellHeight, cellWidth, cellHeight);
    }
    
    switch (e.which) {
        case 37: // left
            if (playerProp.pCol > 0) {
                if (maze[playerProp.pRow][playerProp.pCol - 1] != 1) {
                    playerProp.pCol = playerProp.pCol - 1;
                }
            }
            break;
        case 38: //up
            if (playerProp.pRow > 0) {
                if (maze[playerProp.pRow - 1][playerProp.pCol] != 1) {
                    playerProp.pRow = playerProp.pRow - 1;
                }
            }
            break;
        case 39: // right
            if (playerProp.pCol < maze[0].length - 1) {
                if (maze[playerProp.pRow][playerProp.pCol + 1] != 1) {
                    playerProp.pCol = playerProp.pCol + 1;
                }
            }
            break;
        case 40: // down
            if (playerProp.pRow < maze[0].length) {
                if (maze[playerProp.pRow + 1][playerProp.pCol] != 1) {
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
    var sol = "11333333331";
    solution = sol;

    for (var i = 0; i < solution.length; i++) {
        if (playerProp.pRow != exitR || playerProp.pCol != exitC) {
            context.fillStyle = "white";
            context.fillRect(playerProp.pCol * cellHeight, playerProp.pRow * cellWidth, cellWidth, cellHeight);
        } else {
            var exit = document.getElementById("exit");
            context.drawImage(exit, exitC * cellWidth, exitR * cellHeight, cellWidth, cellHeight);
        }

        switch (solution[i]) {
            case '0': // left
                if (playerProp.pCol > 0) {
                    if (maze[playerProp.pRow][playerProp.pCol - 1] != 1) {
                        playerProp.pCol = playerProp.pCol - 1;
                    }
                }
                break;
            case '2': //up
                if (playerProp.pRow > 0) {
                    if (maze[playerProp.pRow - 1][playerProp.pCol] != 1) {
                        playerProp.pRow = playerProp.pRow - 1;
                    }
                }
                break;
            case '1': // right
                if (playerProp.pCol < maze[0].length - 1) {
                    if (maze[playerProp.pRow][playerProp.pCol + 1] != 1) {
                        playerProp.pCol = playerProp.pCol + 1;
                    }
                }
                break;
            case '3': // down
                if (playerProp.pRow < maze[0].length) {
                    if (maze[playerProp.pRow + 1][playerProp.pCol] != 1) {
                        playerProp.pRow = playerProp.pRow + 1;
                    }
                }
                break;
        }
        
        context.drawImage(player, playerProp.pCol * cellHeight, playerProp.pRow * cellWidth, cellWidth, cellHeight);

        if (playerProp.pRow == exitR && playerProp.pCol == exitC) {
            alert("Yay!");
            break;
        }
        // need to sleep somehow for animation.
    }
}