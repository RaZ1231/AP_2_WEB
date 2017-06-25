//draws the table.
function stripes() {
    $("tr").each(function () {
        $(this).removeClass("striped");
    });
    $("tr:even").each(function () {
        $(this).addClass("striped");
    });
}

// when page is loaded.
$(document).ready(function () {
    if (sessionStorage.getItem("username") === null) { // no one connected
        $("#menuBar").load("Menu.html");
    } else { // user connected
        $("#menuBar").load("ConnectedMenu.html");
    }
    var apiUrl = "/api/Users/";

    $.getJSON(apiUrl).done(function (data) {
        //get data from DB and add to tablescores.
        var i = 1;
        data.forEach(function (user) {
            var tr = document.createElement('TR');
            
            var td = document.createElement('TD');
            var b = document.createElement("b");
            td.appendChild(document.createTextNode(i));
            b.appendChild(td);
            tr.appendChild(td);

            td = document.createElement('TD');
            td.appendChild(document.createTextNode(user.Username)); 
            tr.appendChild(td);

            td = document.createElement('TD');
            td.appendChild(document.createTextNode(user.Wins));
            tr.appendChild(td);

            td = document.createElement('TD');
            td.appendChild(document.createTextNode(user.Loses));
            tr.appendChild(td);

            $("#rankingTable").append(tr);
            i = i + 1;

        });
        stripes();

    });
});
