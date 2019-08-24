import {create_players, move} from './gravity';

const button = document.getElementById("login");
const input = document.getElementById("username");

button.disabled = true;

input.addEventListener("input", function(event) {
  button.disabled = input.value ? false : true;
})

button.addEventListener("click", async function(event) {
    // put code here
    let response = await fetch("/test_players", { method: "POST", body: JSON.stringify({ name: input.value }) });
    const data = await response.json();
    console.log(data);
    goToMain();
})

function goToLogin() {
    document.getElementById("main-page").style.display = "none";
    document.getElementById("login-page").style.display = "flex";
}

function goToMain() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-page").style.display = "flex";
/*
    while(1){
        await delay(500);
        let response = await fetch("/get_players");
        const list = await response.json();
        console.log(list);
    }
*/


    //create_players(["neil", "damian"]);
    console.log("?");
    move([{vx:0, vy:0},{vx:0, vy:0}]);

}
