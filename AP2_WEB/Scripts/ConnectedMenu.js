$(document).ready(function () {
    $("#user").load(function () {
        //$("#user").text
    });

    $("#logOff").click(function (e) {
        e.preventDefault();
        sessionStorage.removeItem("username");
        alert("erased");
        window.location.replace("HomePage.html");
        });
});