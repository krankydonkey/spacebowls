"""
author: sanni
"""

from sanic import Sanic
from sanic.response import json

app = Sanic(__name__)

list_of_players = []

app.static("/static", "../frontend/dist")
app.static("/", "../frontend/dist/index.html")

@app.route("/test_players", methods=["POST"])
async def get_name(request):
    """
    Adds player to the list of players and ensures that the player name is
    unique.

    Parameters:
        request (Request): The request made by the client, which includes the
         name of the player.

    Returns
        (Request): A request object in json format which includes the entire
        list of players.
    """
    player_name = request.json["name"]

    if len(list_of_players) > 7:
        return json("Too many players, try later")
    elif player_name not in list_of_players:
        list_of_players.append(player_name)
    else:
        return json("ERROR")

    return json({"players": list_of_players})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)


