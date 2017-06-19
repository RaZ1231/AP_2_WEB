// when page start.
$(document).ready(function () {
    if (localStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else { // user connected
        $("#menuBar").load("ConnectedMenu.html");
    }
    $("#rows").val(0);
    $("#cols").val(0);

    // save settings
    $("#btnSave").on("click", function () {
        localStorage.setItem("defaultRows", $("#rows").val());
        localStorage.setItem("defaultCols", $("#cols").val());
        localStorage.setItem("defaultSearch", $("#solveAlgo").val());
    });

});