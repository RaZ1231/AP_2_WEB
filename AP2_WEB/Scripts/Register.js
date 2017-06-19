$(document).ready(function () {
    if (localStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else {
        $("#menuBar").load("ConnectedMenu.html");
    }

    var apiUrl = "/api/Users/";

    // register
    $("#btnSubmit").click(function () {
        var user = {
            Username: $("#inputUsername").val(),
            Password: $("#inputPassword").val(),
            Email: $("#inputEmail").val(),
            JoinDate: new Date(),
            Wins: 0,
            Loses: 0
        }

        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function (result) {
                $("#txtAnswer").text("User added! click List btn to see changes");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $("#txtAnswer").text("ERROR");
                switch (XMLHttpRequest.responseJSON) {
                    case "Username":
                        $("#txtAnswer").text("Username taken!");
                        break;
                    case "Email":
                        $("#txtAnswer").text("Email taken!");
                        break;
                }
            }
        });
    });
});
