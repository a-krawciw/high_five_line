if (document.location.hostname === '127.0.0.1') {
    var ws = new WebSocket('ws://' + document.location.host + '/adminws/');
} else {
    var ws = new WebSocket('wss://' + document.location.host + '/adminws/')
}

setTimeout(ping, 20000);

function ping() {
    message = {type: "ping", target: "none", ID: uuidv4()}
    ws.send(JSON.stringify(message));
    setTimeout(ping, 20000)
}

ws.onmessage = function (event) {
    console.log(event.data)
}

function sendBanner(text) {
    message = {type: "banner", target: 'all', sender: 'admin', payload: text}

    ws.send(JSON.stringify(message))
}
