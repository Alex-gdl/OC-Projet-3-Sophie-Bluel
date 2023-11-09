const loginInfo = document.querySelector(".login-info");
const messageError = document.getElementById("error");
const loginURL = "http://localhost:5678/api/users/login";

loginInfo.addEventListener("submit", function (event) {
  event.preventDefault();

  const { email, password } = loginInfo.elements;

  if (email.value === "" || password.value === "") {
    messageError.style.display = "flex";
    return;
  }

  messageError.style.display = "none";

  fetch(loginURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("auth", JSON.stringify(data));
      const auth = JSON.parse(localStorage.getItem("auth"));

      if (auth && auth.token) {
        window.location = "index.html";
      } else {
        messageError.style.display = "flex";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      messageError.style.display = "flex";
    });
});

