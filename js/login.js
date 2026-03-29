const usernameForm = document.getElementById("username");
const pwdForm = document.getElementById("pwd");

document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameForm.value;
  const password = pwdForm.value;
  
  let userObject = { username: username, password: password };

  let users = JSON.parse(localStorage.getItem("user")) || [];

  let userFound = false;

  for (let user of users) {
    if (
      userObject.username == user.username &&
      userObject.password == user.password
    ) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      userFound = true;
      location.href = "game.html";
    }else if(userObject.username == user.username && userObject.password != user.password)
    {
        userFound = true;
        document
        .querySelector("#info")
        .innerText = "Fel lösenord. Försök igen.";
    }    
  }

  if (!userFound) {
    userObject = { username, password, balance: 0 };
    users.push(userObject);
    localStorage.setItem("user", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(userObject));
    location.href = "game.html";
  }
});
