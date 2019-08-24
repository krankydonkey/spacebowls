import {create_players, move, bowls, radius } from './gravity';
import { delay } from "./util";

const button = document.getElementById("login");
const input = document.getElementById("username");
const canvas = document.getElementById("game");
export let id;
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
            for (let i = 0; i < 3; ++i) {
              console.log("???");
              await goToRoundMove(list.players);
            }
            break;
        }
    }
}

function getCoordsInCanvas(x, y) {
  const { top, left, height, width } = canvas.getBoundingClientRect();
  const relative_x = canvas.width * (x - left) / width;
  const relative_y = canvas.height * (y - top) / height;

  return { x: relative_x, y: relative_y };
}

async function goToRoundMove(players){
    let vx, vy;

    if (bowls[id].in) {
      // this function draws an arrow from a player's bowl/planet and 
      //the length that they stretch it out to is the speed they're choosing
      let og_vx = bowls[id].x
      let og_vy = bowls[id].y;
      let new_vx;
      let new_vy;

      let resolve;
      const haveData = new Promise(res => {
        resolve = res;
      });

      function mouseDown(event) {
        const { x, y } = getCoordsInCanvas(event.clientX, event.clientY);
        console.log({ x, y });
        if ((x - og_vx) * (x - og_vx) + (y - og_vy) * (y - og_vy) < radius * radius) {
          document.removeEventListener("mousedown", mouseDown);

          function mouseUp(event) {
            new_vx = getCoordsInCanvas(event.clientX, event.clientY).x;
            new_vy = getCoordsInCanvas(event.clientX, event.clientY).y;

            console.log({ new_vx, new_vy });

            document.removeEventListener("mouseup", mouseUp);
            resolve();
          }

          document.addEventListener("mouseup", mouseUp);
        }
      }

      document.addEventListener("mousedown", mouseDown);

      await haveData;

      let vx_unscaled = new_vx - og_vx;
      let vy_unscaled = new_vy - og_vy;

      const { height, width } = canvas.getBoundingClientRect();
      const maxDraw = Math.sqrt(height * height + width * width);

      vx = 20 / maxDraw * vx_unscaled;
      vy = 20 / maxDraw * vy_unscaled;
    } else {
      vx = 0;
      vy = 0;
    }

    let response = await fetch("/vector", { method: "POST", body: JSON.stringify({ name: { id, vx, vy } }) });
    let data = await response.json();
  
    while (data.vectors.some(x => x === null)) {
      response = await fetch("/get_vectors");
      data = await response.json();
      await delay(200);
    }

    await move(data.vectors);
}
