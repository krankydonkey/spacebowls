import {create_players, move} from './gravity';
import { delay } from "./util";

const button = document.getElementById("login");
const input = document.getElementById("username");

button.disabled = true;

input.addEventListener("input", function(event) {
  button.disabled = input.value ? false : true;
});

button.addEventListener("click", async function(event) {
    // put code here
    let response = await fetch("/name", { method: "POST", body: JSON.stringify({ name: input.value }) });
    const data = await response.json();
    console.log(data);
    if (data != -1){
          await goToMain();
    } else {
        document.getElementById("status").innerText = "Name taken. Enter a different name."
    }
  
});

function goToLogin() {
    document.getElementById("main-page").style.display = "none";
    document.getElementById("login-page").style.display = "flex";
}

async function goToMain() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-page").style.display = "grid";
    while(1){
        await delay(500);
        let response = await fetch("/get_players");
        const list = await response.json();
        create_players(list.players);
        if (list.players.length == 8){
            break;
        }
    }
    move([{vx:0, vy:0},{vx:0, vy:0},{vx:0, vy:0},{vx:0, vy:0},{vx:0, vy:0},{vx:0, vy:0},{vx:0, vy:0},{vx:0, vy:0}]);
}
