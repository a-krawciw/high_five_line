from quart import Quart
from quart import render_template

app = Quart(__name__)


@app.route('/')
async def dashboard():
    return await render_template("High_Five_Dashboard.html")

@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
