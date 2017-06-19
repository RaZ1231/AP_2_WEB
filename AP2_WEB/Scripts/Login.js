$(document).ready(function () {
    if (sessionStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");

        var apiUrl = "/api/Users/";
        // login
        $("#btnLogin").click(function () {
            var user = {
                Username: $("#txtUsername").val(),
                Password: $("#txtPassword").val()
            }

            $.ajax({
                url: apiUrl + 'login',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(user),
                success: function (result) {
                    sessionStorage.setItem("username", user.Username);
                    window.location.replace("HomePage.html");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#txtLoginAnswer").text("ERROR");
                    switch (XMLHttpRequest.responseJSON) {
                        case "Username":
                            $("#txtLoginAnswer").text("Wrong Username!");
                            break;
                        case "Password":
                            $("#txtLoginAnswer").text("Wrong Password!");
                            break;
                    }
                }
            });
        });
    } else {
        $("#menuBar").load("ConnectedMenu.html");
    }


});
