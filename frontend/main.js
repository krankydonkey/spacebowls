import {create_players, move, bowls, radius } from './gravity';
import { delay } from "./util";

const button = document.getElementById("login");
const input = document.getElementById("username");
let id;
let alt_id;

button.disabled = input.value ? false : true;

input.addEventListener("input", function(event) {
  button.disabled = input.value ? false : true;
});

button.addEventListener("click", async function(event) {
    // put code here
    let response = await fetch("/name", { method: "POST", body: JSON.stringify({ name: input.value }) });
    const data = await response.json();
    console.log(input.value);
    console.log(data.players);
    id = data.players[input.value];
    alt_id = input.value;
    if (data == -1) {
        document.getElementById("status").innerText = "Name taken. Enter a different name."
    } else if (data == 0) {
        document.getElementById("status").innerText = "Player limit reached, try again later."
    } else {
        await goToMain();
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
        console.log("X: " + bowls[id].vx + " Y: " + bowls[id].vy);
        if (list.players.length == 8){
            //console.log("X: " + bowls[id].vx + " Y: " + bowsl[id].vy);
            break;
        }
    }
    await goToRoundMove(list.players);
}


async function goToRoundMove(players){
     //this function draws an arrow from a player's bowl/planet and 
    //the length that they stretch it out to is the speed they're choosing
    let og_vx = bowls[id].vx
    let og_vy = bowls[id].vy;
    let new_vx;
    let new_vy;

    document.addEventListener("onmousedown", async function(event){
        if((event.clientX >= (og_vx - 5) && event.clientX <= (og_vx + 5)) && (event.clientX >= (og_vy - 5) && event.clientX <= (og_vy + 5))){
            document.addEventListener("onmouseup", async function(event){
                new_vx = event.clientX;
                new_vy = event.clientY;
            });
        }
    });

    let vx = og_vx - new_vx;
    let vy = og_vy - new_vy;

    let response = await fetch("/vector", { method: "POST", body: JSON.stringify({ name: { id, vx, vy } }) });
    const data = await response.json();
    await delay(5000);
    await move(data);
}
