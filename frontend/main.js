const button = document.getElementById("login");
const input = document.getElementById("username");

button.disabled = true;

input.addEventListener("input", function(event) {
  button.disabled = input.value ? false : true;
})

button.addEventListener("click", function(event) {
    console.log(input.value);
    // put code here
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
