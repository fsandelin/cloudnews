import asyncio
from quart import Quart

async def abar(a):
    print(a)

app = Quart(__name__)

@app.route("/")
async def notify():
    await abar("abar")
    return "OK"

if __name__ == "__main__":
    app.run(debug=False)