$(document).ready(function () {
    if (localStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else {
        $("#menuBar").load("ConnectedMenu.html");
    }
});
