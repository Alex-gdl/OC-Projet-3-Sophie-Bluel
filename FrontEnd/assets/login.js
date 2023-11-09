const loginInfo = document.querySelector(".login-info");
const messageError = document.getElementById("error");
const loginURL = "http://localhost:5678/api/users/login";

loginInfo.addEventListener("submit", handleLogin);

function handleLogin(event) {
  event.preventDefault();

  const { email, password } = loginInfo.elements;

  if (isFieldEmpty(email.value) || isFieldEmpty(password.value)) {
    displayError("Erreur");
    return;
  }

  hideError();

  const credentials = {
    email: email.value,
    password: password.value,
  };

  sendLoginRequest(credentials);
}

function isFieldEmpty(value) {
  return value.trim() === "";
}

function displayError(message) {
  messageError.textContent = message;
  messageError.style.display = "flex";
}

function hideError() {
  messageError.style.display = "none";
}

function sendLoginRequest(credentials) {
  fetch(loginURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(credentials),
  })
    .then(handleResponse)
    .catch(handleError);
}

function handleResponse(response) {
  if (response.ok) {
    return response.json().then(handleSuccess);
  } else {
    return response.json().then(handleFailure);
  }
}

function handleSuccess(data) {
  localStorage.setItem("auth", JSON.stringify(data));
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (auth && auth.token) {
    window.location = "index.html";
  } else {
    displayError("Erreur");
  }
}

function handleFailure(error) {
  console.error("Error:", error);
  displayError("Erreur");
}
