"""
author: sanni
"""

from sanic import Sanic
from sanic.response import json

app = Sanic(__name__)

list_of_players = []

app.static("/static", "../frontend/dist")
app.static("/", "../frontend/dist/index.html")


@app.route("/name", methods=["POST"])
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
        return json("Too many players, try later.")
    elif player_name not in list_of_players:
        list_of_players.append(player_name)
    else:
        return json("Please enter another name.")

    return json({"players": list_of_players})


@app.route("/get_players")
async def get_players(request):
    """
    Returns the list of players currently in the game.

    Parameter:
        request (Request): The request made by the client, which includes the
         name of the player.

    Returns:
        (Request): A request object in json format which includes the entire
        list of players.
    """
    return json({"players": list_of_players})

# TODO: clear array method

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)


