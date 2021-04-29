import asyncio
import json

from quart import Quart, websocket
from quart import render_template

app = Quart(__name__)

valid_teams = ['3491', '1234', '3214', '2442']


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

@app.websocket('/<teamname>/ws')
async def ws(teamname):
    if teamname  in valid_teams:
        global connected_websockets
        queue = asyncio.Queue()
        connected_websockets[teamname].add(queue)
        try:
            await asyncio.gather(send(queue), receive(teamname))
        finally:
            connected_websockets[teamname].remove(queue)


@app.route('/<teamname>/')
async def dashboard(teamname):
    if teamname not in valid_teams:
        return "That is valid team number."
    return await render_template("High_Five_Dashboard.html", teamname=teamname, valid_teams=valid_teams)

async def broadcast(message, target):
    for queue in connected_websockets[target]:
        await queue.put(message)

if __name__ == '__main__':
    app.run()
