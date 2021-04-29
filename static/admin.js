var ws = new WebSocket('ws://' + document.location.host + '/adminws/');
ws.onmessage = function (event) {
    console.log(event.data)
}

function sendBanner(text) {
    message = {type: "banner", target: 'all', sender: 'admin', payload: text}

    ws.send(JSON.stringify(message))
}
