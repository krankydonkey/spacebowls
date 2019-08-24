"""
author: sanni
"""

from sanic import Sanic
from sanic.response import json

app = Sanic(__name__)

list_of_players = []
players = {}

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
        # 8 players reached, the game is full
        return json(0)
    elif player_name not in list_of_players:
        players[player_name] = len(list_of_players)
        list_of_players.append(player_name)
        return json({"players": players})
    else:
        # the username already exists
        return json(-1)


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


@app.route("/clear_players")
async def clear_players(request):
    """
    Clears the array of the list of players.

    Parameter:
        request (Request): The request made by the client.
    """
    global list_of_players
    list_of_players = []


vectors = [None, None, None, None, None, None, None, None]


@app.route("/vector", methods=["POST"])
async def add_to_vectors(request):
    global vectors

    vector = request.json["name"]
    index, vx, vy = vector
    vectors[index] = (vx, vy)

    for item in vectors:
        if item is None:
            return
    return vectors

    # if len(vectors) == 8:
    #     json_vectors = json(vectors)
    #     vectors = []
    #     return json_vectors


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)


