//when home page is loaded, checks whether a user is connected in order to load right menu bar.
$(document).ready(function () {
    if (sessionStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else {
        $("#menuBar").load("ConnectedMenu.html");
    }
});
