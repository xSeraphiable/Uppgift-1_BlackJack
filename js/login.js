
const usernameForm = document.getElementById("username");
const pwdForm = document.getElementById("pwd");



document.querySelector("#submit").addEventListener("click", () =>{

    const username = usernameForm.value;   
    const password = pwdForm.value;
    let userObject = {"username":username, "password":password};


    let users = JSON.parse(localStorage.getItem("user")) || [];

    let userFound = false;

    for(let user of users)
    {
        if (userObject.username == user.username && userObject.password == user.password)
        {                     
                localStorage.setItem("currentUser", JSON.stringify(userObject));
                userFound = true;   
                window.location.href = "game.html";           
        }        
    }
    if(!userFound){
        userObject = {username, password, balance: 0};
        localStorage.setItem("user", JSON.stringify(userObject));
        localStorage.setItem("currentUser", JSON.stringify(userObject));
        window.location.href = "game.html";
    }    

});


