const button = document.getElementById("login");
const input = document.getElementById("username");

button.addEventListener("click", function(event) {
    console.log(input.value);
})