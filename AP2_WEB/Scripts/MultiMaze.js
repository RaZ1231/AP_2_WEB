function playerObj() {
    var pRow;
    var pCol;
}



var apiUrl = "/api/Maze/"; // base uri of requests
var apiUsers = "/api/Users/";

var keydownFlag = true;
var cellWidth;
var cellHeight;
var maze;
var myMazeCanvas;
var opMazeCanvas;
var exitR;
var exitC;
var startR;
var startC;
var chat;
var start = true;

var myPlayerProp = new playerObj();

var opPlayerProp = new playerObj();

function windowClose() {
    chat.server.move(
        maze.Name, 4
    );
}

$(document).ready(function () {
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
            window.onbeforeunload = windowClose;

            var myCanvas = $(this)[0];
            var context = myCanvas.getContext("2d");
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

            myPlayerProp.pRow = startRow;
            myPlayerProp.pCol = startCol;

            opPlayerProp.pRow = startRow;
            opPlayerProp.pCol = startCol;

            if (myCanvas === document.getElementById("opMazeCanvas")) {
                document.getElementById("loader").style.display = "none";
            }

            if (keydownFlag) {
                keydownFlag = false;
                $(document).keydown(keyDown);
            }

            return this;
        }
    })(jQuery);

    if (sessionStorage.getItem("username") === null) { // no one is connected.
        $("#menuBar").load("Menu.html");
        $("#multiPlayer").load("NoUserConnected.html")
    } else {
        $("#menuBar").load("ConnectedMenu.html");
        $("#rows").val(localStorage.getItem("defaultRows"));
        $("#cols").val(localStorage.getItem("defaultCols"));

        // Declare a proxy to reference the hub
        chat = $.connection.gameHub;

        chat.client.broadcastMessage = function (json) {
            if (first) {
                first = false;
                $("#waitingMsg").text(" ");
                maze = JSON.parse(json);
                $(document).title = maze.Name;

                $("#myMazeCanvas").mazeBoard(
                    maze.Maze, // the matrix containing the maze cells
                    maze.Start.Row,
                    maze.Start.Col, // initial position of the player
                    maze.End.Row,
                    maze.End.Col, // the exit position 
                    document.getElementById("player"), // player's icon (of type Image)
                    document.getElementById("exit"), // exit icon
                    true,
                    keyDown
                );
                $("#opMazeCanvas").mazeBoard(
                    maze.Maze, // the matrix containing the maze cells
                    maze.Start.Row,
                    maze.Start.Col, // initial position of the player
                    maze.End.Row,
                    maze.End.Col, // the exit position 
                    document.getElementById("player"), // player's icon (of type Image)
                    document.getElementById("exit"), // exit icon
                    true,
                    keyDown
                );
                window.document.title = maze.Name;
            } else {
                move(json);
            }

        };

        $.connection.hub.start().done(function () {
            // Start
            $('#btnNewGame').click(function () {
                if ($("#mazeName").val() != "" && $("#rows").val() > 0 && $("#cols").val() > 0) {
                    first = true;
                    document.getElementById("loader").style.display = "block";
                    chat.server.start(
                        $("#mazeName").val(),
                        $("#rows").val(),
                        $("#cols").val()
                    );
                    $("#waitingMsg").text("Waiting for another player...");
                }
            });

            // Join
            $('#btnJoinMessage').click(function () {
                if ($("#gamesList").val() != "") {
                    first = true;
                    chat.server.join(
                        $("#gamesList").val()
                    );
                }
            });
        });


        // list
        $.getJSON(apiUrl).done(function (data) {
            $('#gamesList').html('');
            data.forEach(function (game) {
                $('#gamesList').append($('<option>', {
                    value: game,
                    text: game
                }));
            });
        });
    }

    function keyDown(e) {
        var playerProp = myPlayerProp;
        var context = document.getElementById("myMazeCanvas").getContext("2d");
        var direction;
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
                direction = 0;
                break;
            case 38: //up
                if (playerProp.pRow > 0) {
                    if (mazeMatrix[playerProp.pRow - 1][playerProp.pCol] != 1) {
                        playerProp.pRow = playerProp.pRow - 1;
                    }
                }
                direction = 2;
                break;
            case 39: // right
                if (playerProp.pCol < maze.Cols - 1) {
                    if (mazeMatrix[playerProp.pRow][playerProp.pCol + 1] != 1) {
                        playerProp.pCol = playerProp.pCol + 1;
                    }
                }
                direction = 1;
                break;
            case 40: // down
                if (playerProp.pRow < maze.Rows - 1) {
                    if (mazeMatrix[playerProp.pRow + 1][playerProp.pCol] != 1) {
                        playerProp.pRow = playerProp.pRow + 1;
                    }
                }
                direction = 3;
                break;
        }

        context.drawImage(player, playerProp.pCol * cellWidth, playerProp.pRow * cellHeight, cellWidth, cellHeight);

        var mName = maze.Name;

        // Move
        chat.server.move(
            mName,
            direction
        );

        if (playerProp.pRow == exitR && playerProp.pCol == exitC) {
            var userInfo = {
                Username: sessionStorage.username
            };

            $.ajax({
                url: apiUsers + 'win',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(userInfo),
                success: function (result) { }
            });
            alert("You Win!");
            window.location.replace("HomePage.html");
        }
    }

    function move(json) {
        var moveObj = JSON.parse(json);
        var direction = moveObj.Direction;
        var playerProp = opPlayerProp;
        var canvas = document.getElementById("opMazeCanvas");
        var context = canvas.getContext("2d");
        if (playerProp.pRow != exitR || playerProp.pCol != exitC) {
            context.fillStyle = "white";
            context.fillRect(playerProp.pCol * cellWidth, playerProp.pRow * cellHeight, cellWidth, cellHeight);
        } else {
            var exit = document.getElementById("exit");
            context.drawImage(exit, exitC * cellWidth, exitR * cellHeight, cellWidth, cellHeight);
        }

        switch (direction) {
            case "Left": // left
                if (playerProp.pCol > 0) {
                    if (mazeMatrix[playerProp.pRow][playerProp.pCol - 1] != 1) {
                        playerProp.pCol = playerProp.pCol - 1;
                    }
                }
                break;
            case "Up": //up
                if (playerProp.pRow > 0) {
                    if (mazeMatrix[playerProp.pRow - 1][playerProp.pCol] != 1) {
                        playerProp.pRow = playerProp.pRow - 1;
                    }
                }
                break;
            case "Right": // right
                if (playerProp.pCol < maze.Cols - 1) {
                    if (mazeMatrix[playerProp.pRow][playerProp.pCol + 1] != 1) {
                        playerProp.pCol = playerProp.pCol + 1;
                    }
                }
                break;
            case "Down": // down
                if (playerProp.pRow < maze.Rows - 1) {
                    if (mazeMatrix[playerProp.pRow + 1][playerProp.pCol] != 1) {
                        playerProp.pRow = playerProp.pRow + 1;
                    }
                }
                break;
            case "4":
                alert("Other player closed game");
                window.location.replace("HomePage.html");
                break;
        }

        context.drawImage(player, playerProp.pCol * cellWidth, playerProp.pRow * cellHeight, cellWidth, cellHeight);

        if (playerProp.pRow == exitR && playerProp.pCol == exitC) {
            var userInfoLose = {
                Username: sessionStorage.username
            };

            $.ajax({
                url: apiUsers + 'lose',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(userInfoLose),
                success: function (result) { }
            });

            alert("You lose!");
            window.location.replace("HomePage.html");
        }
    }
});
