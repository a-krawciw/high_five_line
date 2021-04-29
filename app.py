import asyncio
import json

from quart import Quart, websocket
from quart import render_template

app = Quart(__name__)

valid_teams = ['3491', '1234', '3214', '2442', 'Volunteer']
active_banner = ""


connected_websockets = {team: set() for team in valid_teams}

async def send(queue):
    while True:
        data = await queue.get()
        await websocket.send(data)

async def receive(teamname):
    decoder = json.JSONDecoder()
    encoder = json.JSONEncoder()
    while True:
        message = await websocket.receive()
        message_map = decoder.decode(message)
        message_map['sender'] = teamname

        await broadcast(encoder.encode(message_map), teamname)
        await broadcast(encoder.encode(message_map), message_map["target"])

@app.websocket('/view/<teamname>/ws')
async def ws(teamname):
    if teamname  in valid_teams:
        global connected_websockets
        queue = asyncio.Queue()
        connected_websockets[teamname].add(queue)
        try:
            await asyncio.gather(send(queue), receive(teamname))
        finally:
            connected_websockets[teamname].remove(queue)

@app.route('/fluffykins/fun/times/')
async def admin_page():
    return await render_template("admin.html")

@app.route('/view/<teamname>/')
async def dashboard(teamname):
    if teamname not in valid_teams:
        return "That is not a valid team number."
    return await render_template("High_Five_Dashboard.html", teamname=teamname, valid_teams=valid_teams, banner=active_banner)

@app.route('/')
async def welcome():
    return await render_template("welcome.html", valid_teams=valid_teams)

async def broadcast(message, target):
    for queue in connected_websockets[target]:
        await queue.put(message)

async def broadcast_all(message):
    for targets in connected_websockets.values():
        for queue in targets:
            await queue.put(message)


@app.websocket('/adminws/')
async def admin():
    global active_banner
    decoder = json.JSONDecoder()
    while True:
        message = await websocket.receive()
        message_map = decoder.decode(message)
        active_banner = message_map['payload']
        await broadcast_all(message)


if __name__ == '__main__':
    app.run()
