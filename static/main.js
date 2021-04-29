var ws = new WebSocket('ws://' + document.location.host + document.location.pathname + 'ws');


function getNewHighFive(name, locX, locY) {
    var elem = "<figure " +
            "id='receipt-" + name + "' class='hifive' " +
            "onclick='returnHighFive(\"" + name + "\")' " +
            "style='left: " + locX + "px; top: " + locY + "px;'>" + 
            "<div><span>" + name + "</span></div>" + 
            "</figure>";

    return elem
}

function getNewSentHighFive(name, locX, locY) {
    var elem = "<figure " +
            "id='sent-" + name + "' class='hifive sent-hifive' " +
            "style='left: " + locX + "px; top: " + locY + "px;'>" + 
            "<div><span>" + name + "</span></div>" + 
            "</figure>";

    return elem
}



ws.onmessage = function (event) {
    console.log(event.data);
    message = JSON.parse(event.data)

    if (message.type === "banner") {
        $("#banner").html(message.payload);
    } else if (message.type === "create") {
        if (document.location.pathname.includes(message.target)) {
            highFive(message);
        } else if (document.location.pathname.includes(message.sender)) {
            sentHighFive(message);
        }
    } else if (message.type === "accept") {
        removeHighFive("receipt-" + message.target);
        removeHighFive("sent-" + message.sender);
    }
};

function highFive(message) {
    randX = Math.floor(Math.random() * ($("#main-canvas").width() - 76));
    randY = Math.floor(Math.random() * ($("#main-canvas").height() - 100));   

    $("#main-canvas").append(getNewHighFive(message.sender, randX, randY));
}

function sentHighFive(message) {
    randX = Math.floor(Math.random() * ($("#main-canvas").width() - 76));
    randY = Math.floor(Math.random() * ($("#main-canvas").height() - 100));

    $("#main-canvas").append(getNewSentHighFive(message.target, randX, randY));
}

function removeHighFive(id) {
    $("#" + id).html("High Five!");
    setTimeout(function(){ $("#" + id).remove() }, 1000);
}

function createHighFive(target_name){
    message = {type: "create", target: target_name}
    ws.send(JSON.stringify(message));
}

function returnHighFive(sender_name) {
    message = {type: "accept",  target: sender_name}
    ws.send(JSON.stringify(message))
}