import asyncio
import json
import os

from quart import Quart, websocket, send_from_directory, redirect
from quart import render_template

app = Quart(__name__)

valid_teams = ['3491', '13459', '15013', '15479',
               '16031', '16140', '16195', '16205',
               '16267', '16353', '16448', '17453',
               '18191', '18502', '18589', '18779',
               '18800', '18840', '18841', 'Volunteer',
               'Parent', 'Other']
active_banner = ""


@app.route('/favicon.ico')
async def favicon():
    return await send_from_directory(os.path.join(app.root_path, 'static/images'), 'first-favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


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
    if teamname in valid_teams:
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


@app.route("/view/")
async def send_home():
    return redirect("/", code=303)


@app.route('/view/<teamname>/')
async def dashboard(teamname):
    if teamname not in valid_teams:
        return "That is not a valid team number."
    return await render_template("High_Five_Dashboard.html", teamname=teamname, valid_teams=valid_teams,
                                 banner=active_banner)


@app.route('/')
async def welcome():
    return await render_template("welcome.html", valid_teams=valid_teams)


async def broadcast(message, target):
    if target in connected_websockets.keys():
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

        if "payload" in message_map:
            active_banner = message_map['payload']
            await broadcast_all(message)


if __name__ == '__main__':
    app.run()
