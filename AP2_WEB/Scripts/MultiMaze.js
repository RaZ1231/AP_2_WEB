function playerObj() {
    var pRow;
    var pCol;
}

var context;
var cellWidth;
var cellHeight;
var maze;
var myMazeCanvas;
var opMazeCanvas;
var exitR;
var exitC;
var startR;
var startC;

var myPlayerProp = new playerObj();

var opPlayerProp = new playerObj();

$(document).ready(function () {
    $("#menuBar").load("Menu.html");

    // Declare a proxy to reference the hub
    var chat = $.connection.gameHub;

    chat.client.broadcastMessage = function (json) {
        //$('#chat').append('<li><strong>Maze</strong>:&nbsp;&nbsp;' + json + '</li>');
        $("#waitingMsg").text(" ");
        maze = JSON.parse(json);

        $("#myMazeCanvas").mazeBoard(
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
        $("#opMazeCanvas").mazeBoard(
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

        //first push is draw the maze and than change it to draw moves.
    };

    // Start
    $.connection.hub.start().done(function () {
        $('#btnNewGame').click(function () {
            chat.server.start(
                $("#mazeName").val(),
                $("#rows").val(),
                $("#cols").val()
            );
            $("#waitingMsg").text("Waiting for another player...");
        });

        // Join
        $('#btnJoinMessage').click(function () {
            chat.server.join(
                $("#gamesList").val()
            );
            // Clear text box and reset focus for next comment
            $('#message').val('').focus();
        });

        // Move
        $('#btnMoveMessage').click(function () {
            // Call the Send method on the hub
            chat.server.move(
                $("#prodName").val(),
                $("#txtMove").val()
            );
            // Clear text box and reset focus for next comment
            $('#txtMove').val('').focus();
        });
    });


    // list
    var apiUrl = "/api/Maze/"; // base uri of requests
    $.getJSON(apiUrl).done(function (data) {
        $('#gamesList').html('');
        data.forEach(function (game) {
            $('#gamesList').append($('<option>', {
                value: game,
                text: game
            }));
        });
    });

    document.addEventListener("keydown", keydown, false);
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

        myPlayerProp.pRow = startRow;
        myPlayerProp.pCol = startCol;

        opPlayerProp.pRow = startRow;
        opPlayerProp.pCol = startCol;

        return this;
    };
})(jQuery);
