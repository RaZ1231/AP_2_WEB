$(document).ready(function () {
    if (localStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else {
        $("#menuBar").load("ConnectedMenu.html");
    }
    $("#rows").val(0);
    $("#cols").val(0);

    $("#btnSave").on("click", function () {
        localStorage.setItem("defaultRows", $("#rows").val());
        localStorage.setItem("defaultCols", $("#cols").val());
        localStorage.setItem("defaultSearch", $("#solveAlgo").val());
    });

});