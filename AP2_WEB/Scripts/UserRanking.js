// when page start.
$(document).ready(function () {
    if (sessionStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else { // user connected
        $("#menuBar").load("ConnectedMenu.html");
    }
    var apiUrl = "/api/Users/";

    $.getJSON(apiUrl).done(function (data) {
        //$("#rankingTable").remove();
        var i = 1;
        data.forEach(function (user) {
            var tr = document.createElement('TR');
            
            var td = document.createElement('TD');
            td.appendChild(document.createTextNode("<b>" + i + "</b>"));
            tr.appendChild(td);

            td = document.createElement('TD');
            td.appendChild(document.createTextNode(user.Username + "</br>" + user.JoinDate));
            tr.appendChild(td);

            td = document.createElement('TD');
            td.appendChild(document.createTextNode(user.Wins));
            tr.appendChild(td);

            td = document.createElement('TD');
            td.appendChild(document.createTextNode(user.Loses));
            tr.appendChild(td);

            document.getElementById("rankingTable").appendChild(tr);
            i = i + 1;

/*
            var table = $("#rankingTable");
            var row = table.insertAfter();
            var rank = row.insertAfter();
            var username = row.insertAfter();
            var wins = row.insertAfter();
            var loses = row.insertAfter();

            rank.innerHTML = "<b>" + i + "</b>";
            username.innerHTML = user.Username + "</br>"
                                + user.JoinDate;
            wins.innerHTML = user.Wins;
            loses.innerHTML = user.Loses;

            i = i + 1;
            */
            /*
            $("<li>" + "<b>" + user.Username + "</b> - "
                + user.Password + ", "
                + user.Email + ", "
                + user.JoinDate + ", "
                + user.Wins + ", "
                + user.Loses
                + "</li>").appendTo("#lstProducts");
        });*/
        });

    });
});
