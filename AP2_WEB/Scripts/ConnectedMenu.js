﻿$(document).ready(function () {
    $("#usermenu").text("Hello, " + sessionStorage.username);

    $("#logOff").click(function (e) {
        e.preventDefault();
        sessionStorage.removeItem("username");
        window.location.replace("HomePage.html");
    });
});