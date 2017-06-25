// when page is loaded.
$(document).ready(function () {
    if (sessionStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else { // user connected
        $("#menuBar").load("ConnectedMenu.html");
    }

    //restart rows and cols to be 0 by deafult.
    $("#rows").val(0);
    $("#cols").val(0);

    // save settings
    $("#btnSave").on("click", function () {
        localStorage.setItem("defaultRows", $("#rows").val());
        localStorage.setItem("defaultCols", $("#cols").val());
        localStorage.setItem("defaultSearch", $("#solveAlgo").val());
    });

});