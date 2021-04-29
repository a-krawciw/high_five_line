var ws = new WebSocket('ws://' + document.location.host + document.location.pathname + 'ws');


function getNewHighFive(name, locX, locY) {
    var elem = "<figure " +
            "id='" + name + "' " +
            "onclick='returnHighFive(\"" + name + "\")' " +
            "style='position: absolute; left: " + locX + "px; top: " + locY + "px; width: 38px; height: 50px'>" + 
            "<img " + 
            "src='/static/images/hand_icon.png' width='38px'; height='50px' " +
            "/>" +
            "<figcaption>" + name + "</figcaption>" +
            "</figure>";

    return elem
}

function getNewSentHighFive(name, locX, locY) {
    var elem = "<figure " +
            "id='" + name + "' " +
            "style='position: absolute; left: " + locX + "px; top: " + locY + "px; width: 38px; height: 50px'>" +
            "<img " +
            "src='/static/images/hand_icon.png' width='38px'; height='50px' " +
            "/>" +
            "<figcaption>" + name + "</figcaption>" +
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
        removeHighFive(message.target);
        removeHighFive(message.sender);
    }
};

function highFive(message) {
    randX = Math.floor(Math.random() * ($("#main-canvas").width() - 38));
    randY = Math.floor(Math.random() * ($("#main-canvas").height() - 50));   

    $("#main-canvas").append(getNewHighFive(message.sender, randX, randY));
}

function sentHighFive(message) {
    randX = Math.floor(Math.random() * ($("#main-canvas").width() - 38));
    randY = Math.floor(Math.random() * ($("#main-canvas").height() - 50));

    $("#main-canvas").append(getNewSentHighFive(message.target, randX, randY));
}

function removeHighFive(id) {
    $("#" + id).remove();
}

function createHighFive(target_name){
    message = {type: "create", target: target_name}
    ws.send(JSON.stringify(message));
}

function returnHighFive(sender_name) {
    message = {type: "accept",  target: sender_name}
    ws.send(JSON.stringify(message))
}