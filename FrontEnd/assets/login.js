const form = document.querySelector(".login-info");
const loginError = document.getElementById("error");
const loginURL = "http://localhost:5678/api";

function getAuthorization() {
  const token = JSON.parse(localStorage.getItem('auth')).token;
  return 'Bearer ' + token;
}

function isConnected() {
  return !!getAuthorization();
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  loginError.style.display = "none";

  const email = form.email.value;
  const password = form.password.value;

  if (!email || !password) {
    loginError.style.display = "flex";
    return;
  }

  try {
    const response = await fetch(loginURL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('auth', JSON.stringify(data));

      if (isConnected()) {
        window.location = "index.html";
      } else {
        loginError.style.display = "flex";
      }
    } else {
      loginError.style.display = "flex";
    }
  } catch (error) {
    console.error('Error:', error);
    loginError.style.display = "flex";
  }
});

if (isConnected()) {
  modeEdition.style.display = "flex";

  logo.style.paddingTop = "25px";
  logo.style.fontSize = "17px";

  menuNav.style.paddingTop = "25px";

  filters.forEach(filter => filter.style.display = "none");

  editBtn.forEach(btn => btn.style.display = "flex");

  logout.textContent = "logout";
  logout.setAttribute("href", "#");

  logout.addEventListener("click", event => {
    event.preventDefault();
    localStorage.removeItem("userId");
    localStorage.removeItem("auth");
    window.location.reload();
  });
}
