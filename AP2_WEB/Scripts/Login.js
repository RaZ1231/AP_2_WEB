//when page is loaded, checks whether a user is connected.
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
                error: function (XMLHttpRequest, textStatus, errorThrown) {//an error occured.
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
    } else { // a user is connected. cannot login again.
        $("#menuBar").load("ConnectedMenu.html");
    }


});
