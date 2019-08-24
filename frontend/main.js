const button = document.getElementById("login");
const input = document.getElementById("username");

button.addEventListener("click", async function(event) {
    console.log(input.value);
    // put code here
    let response = await fetch("http://localhost:8000/test_players", { method: "POST", body: { name: input.value } });
    goToMain();
})

function goToLogin() {
    document.getElementById("main-page").style.display = "none";
    document.getElementById("login-page").style.display = "flex";
}

function goToMain() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-page").style.display = "flex";
}