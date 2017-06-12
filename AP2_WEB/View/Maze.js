function drawMaze(maze) {
    var myCanvas = document.getElementById("mazeCanvas");
    var context = mazeCanvas.getContext("2d");
    var rows = maze.length; var cols = maze[0].length;
    var cellWidth = mazeCanvas.width / cols;
    var cellHeight = mazeCanvas.height / rows;
    var x = 0;
    var y = 0;

    for (x = 0; x < rows; x++) {
        for (y = 0; y < cols; y++) {
            if (maze[x][y] == '*') {
                break;
            }
        }
    }

    var enterence = document.createElement("enterence");
    enterence.src = "/Resources/door.jpg";

    var exit = new Image();
    exit.src = "/Resources/Spiral.jpg";
    exit.height = mazeCanvas.height / rows;
    exit.width = mazeCanvas.width / cols;
    exit.onload = function () {
        context.drawImage(exit, x*cellWidth, y*cellHeight, exit.width, exit.height);
    }
    
    var player = document.getElementById("player");
    player.onload = function () {
        ply_wid = mazeCanvas.width / cols;
        ply_hei = mazeCanvas.height / rows;

        context.drawImage(player, 0, 0, ply_wid, ply_hei);
    }


    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (maze[i][j] == 1) {
                context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
            }
        }
    }
}

function keydown(e) {
    var myCanvas = document.getElementById("mazeCanvas");
    var context = mazeCanvas.getContext("2d");
    var rows = maze.length; var cols = maze[0].length;
    var cellWidth = mazeCanvas.width / cols;
    var cellHeight = mazeCanvas.height / rows;
    var player = document.getElementById("player");
    var ply_wid = mazeCanvas.width / cols;
    var ply_hei = mazeCanvas.height / rows;

    switch (e.which) {
        case 37:
            alert("left");
            break;
        case 38:
            alert("up");
            break;
        case 39:
            alert("right");
            context.drawImage(player, 0, 5 * cellHeight, ply_wid, ply_hei);

            break;
        case 40:
            alert("down");
            break;
    }
}

function handleKeys() {
    var input = document.getElementById("input");
    input.onkeydown(function (e) {
        switch (e.which) {
            case 37:
                alert("left");
                break;
            case 38:
                alert("up");
                break;
            case 39:
                alert("right");
                break;
            case 40:
                alert("down");
                break;
        }
    });
}