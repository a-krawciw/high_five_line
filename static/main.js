var ws = new WebSocket('ws://' + document.location.host + document.location.pathname + 'ws');
ws.onmessage = function (event) {
    console.log(event.data);
    message = JSON.parse(event.data)
    if (document.location.pathname.includes(message.target)){
        highFive()
    } else if (document.location.pathname.includes(message.sender)) {
        console.log("You send a message to " + message.target)
    }
};
function highFive() {
    alert("High five");
}


function createHighFive(target_name){
    message = {type: "create", target: target_name}
    ws.send(JSON.stringify(message));
}