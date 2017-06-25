//when page is loaded.
$(document).ready(function () {
    if (sessionStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else {
        $("#menuBar").load("ConnectedMenu.html");
    }

    var apiUrl = "/api/Users/";

    // register
    $("#btnRegister").click(function () {
        if ($("#inputUsername").val() == "") {
            $("#txtAnswer").text("Please fill in username");
            return;
        }
        if ($("#inputPassword").val() == "") {
            $("#txtAnswer").text("Please fill in password");
            return;
        }
        if ($("#inputPasswordAgain").val() == "") {
            $("#txtAnswer").text("Please fill in password again");
            return;
        }
        if ($("#inputEmail").val() == "") {
            $("#txtAnswer").text("Please fill in email");
            return;
        }
        if ($("#inputPassword").val() != $("#inputPasswordAgain").val()) {
            $("#txtAnswer").text("Passwords don't match");
            return;
        }


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
                sessionStorage.setItem("username", user.Username);
                window.location.replace("HomePage.html");
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
