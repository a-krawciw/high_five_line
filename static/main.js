var ws = new WebSocket('ws://' + document.location.host + document.location.pathname + 'ws');


function getNewHighFive(name, locX, locY) {
    var elem = "<img " + 
            "onclick='returnHighFive(\"" + name + "\")' " +
            "style='position: absolute; left: " + locX + "px; top: " + locY + "px; width: 38px; height: 50px'" +
            "src='/static/images/hand_icon.png' " +
            "/>";

    return elem
}

ws.onmessage = function (event) {
    console.log(event.data);
    message = JSON.parse(event.data)

    if (message.type === "banner") {
        $("#banner").html(message.payload);
    }

    if (document.location.pathname.includes(message.target)){
        highFive(message);
    }

    else if (document.location.pathname.includes(message.sender)) {
        console.log("You send a message to " + message.target)
    }
};

function highFive(message) {
    randX = Math.floor(Math.random() * ($("#main-canvas").width() - 30));
    randY = Math.floor(Math.random() * ($("#main-canvas").height() - 30));   

    console.log(getNewHighFive(message.target, randX, randY));

    $("#main-canvas").append(getNewHighFive(message.target, randX, randY));
}

function createHighFive(target_name){
    message = {type: "create", target: target_name}
    ws.send(JSON.stringify(message));
}