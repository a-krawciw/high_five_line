if (document.location.hostname === '127.0.0.1') {
    var ws = new WebSocket('ws://' + document.location.host + document.location.pathname + 'ws');
} else {
    var ws = new WebSocket('wss://' + document.location.host + document.location.pathname + 'ws');
}

setTimeout(ping, 20000);

function ping() {
    message = {type: "ping", target: "none", ID: uuidv4()}
    ws.send(JSON.stringify(message));
    setTimeout(ping, 20000)
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getNewHighFive(ID, name, locX, locY) {
    var elem = "<figure " +
            "id='id" + ID + "' class='hifive' " +
            "onclick='returnHighFive(\"" + name + "\", \"" + ID + "\")' " +
            "style='left: " + locX + "px; top: " + locY + "px;'>" + 
            "<div><span>" + name + "</span></div>" + 
            "</figure>";

    return elem
}

function getNewSentHighFive(ID, name, locX, locY) {
    var elem = "<figure " +
            "id='id" + ID + "' class='hifive sent-hifive' " +
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
        removeHighFive(message.ID, signoff=1000);
    }
};

function highFive(message) {
    randX = Math.floor(Math.random() * ($("#main-canvas").width() - 76));
    randY = Math.floor(Math.random() * ($("#main-canvas").height() - 100));   

    $("#main-canvas").append(getNewHighFive(message.ID, message.sender, randX, randY));

    setTimeout(function() { 
        removeHighFive(message.ID);
    }, 10000);
}

function sentHighFive(message) {
    randX = Math.floor(Math.random() * ($("#main-canvas").width() - 200));
    randY = Math.floor(Math.random() * ($("#main-canvas").height() - 150)) + 50;

    $("#main-canvas").append(getNewSentHighFive(message.ID, message.target, randX, randY));

    setTimeout(function() { 
        removeHighFive(message.ID);
    }, 10000);
}

function removeHighFive(id, signoff=0) {
    if (signoff > 0) {
        $("#id" + id).html("<span style='background-color: #FAFAFA; color: black; padding: 5px; font-size: 10pt;'>High Five!</span>");
        setTimeout(function(){ $("#id" + id).remove() }, signoff);    
    } else {
        $("#id" + id).remove()
    }
}

function createHighFive(target_name){
    message = {type: "create", target: target_name, ID: uuidv4()}
    ws.send(JSON.stringify(message));
}

function returnHighFive(sender_name, hifive_ID) {
    message = {type: "accept",  target: sender_name, ID: hifive_ID}
    ws.send(JSON.stringify(message))
}