"use strict";

window.addEventListener("load", function () {

    let displayFormConnexion = document.getElementById("displayFormConnexion");
    let displayFormInscription = document.getElementById("displayFormInscription");
    let formConnexion = document.getElementById("formConnexion");
    let formInscription = document.getElementById("formInscription");

    displayFormConnexion.addEventListener("click", function () {
        if (displayFormConnexion.classList.contains('border-gray-400')) {
            displayFormConnexion.classList.remove('border-gray-400');
            displayFormConnexion.classList.add('border-blue-500');
            displayFormInscription.classList.remove('border-blue-500');
            displayFormInscription.classList.add('border-gray-400');
            formConnexion.classList.remove('opacity-0');
            formConnexion.classList.remove('max-h-0');
            formInscription.classList.add('opacity-0');
            formInscription.classList.add('max-h-0');
        }
    });

    displayFormInscription.addEventListener("click", function () {
        if (displayFormInscription.classList.contains('border-gray-400')) {
            displayFormInscription.classList.remove('border-gray-400');
            displayFormInscription.classList.add('border-blue-500');
            displayFormConnexion.classList.remove('border-blue-500');
            displayFormConnexion.classList.add('border-gray-400');
            formInscription.classList.remove('opacity-0');
            formInscription.classList.remove('max-h-0');
            formConnexion.classList.add('opacity-0');
            formConnexion.classList.add('max-h-0');
        }
    });
});

function verificationFormSignIn() {
    let passwordToCheck = document.getElementById("password")
    let usernameToCheck = document.getElementById("username")
    let invalidPassword = document.getElementById("invalidPassword")
    let invalidUsername = document.getElementById("invalidUsername")
    let usernameToCheckEmpty = usernameToCheck.value.length === 0
    let passwordToCheckEmpty = passwordToCheck.value.length === 0
    invalidPassword.innerHTML = passwordToCheckEmpty ? "Veuillez renseigner votre mot de passe !" : "";
    invalidUsername.innerHTML = usernameToCheckEmpty ? "Veuillez renseigner votre pseudo !" : "";
    if (!usernameToCheckEmpty && !passwordToCheckEmpty) {
        let usernameValue = usernameToCheck.value
        let passwordValue = passwordToCheck.value
        let data = {username: usernameValue, password: passwordValue}
        fetch('/auth',
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status !== 200) {
                    return response.json()
                } else {
                    window.location = "/"
                    localStorage.setItem("username", document.getElementById("username").value)
                    return true
                }
            }).then(data => {
            if (data.error === "username") {
                invalidUsername.innerHTML = "Utilisateur inexistant !";
            }
            if (data.error === "password") {
                invalidPassword.innerHTML = "Mauvais mot de passe !";
            }
        })
        return true
    }
}

function verificationFormSignUp() {
    let passwordToCheckSignUp = document.getElementById("passwordSignUp")
    let passwordToCheckConfirm = document.getElementById("passwordConfirmSignUp")
    let usernameToCheckSignUp = document.getElementById("usernameSignUp")
    let firstName = document.getElementById("firstName")
    let name = document.getElementById("name")
    let invalidPasswordSignUp = document.getElementById("invalidPasswordSignUp")
    let invalidUsernameSignUp = document.getElementById("invalidUsernameSignUp")
    let invalidName = document.getElementById("invalidName")
    let invalidFirstName = document.getElementById("invalidFirstName")
    invalidPasswordSignUp.innerHTML =
        passwordToCheckSignUp.value.length === 0 || passwordToCheckConfirm.value.length === 0 ?
            "Veuillez remplir les deux champ !" :
            passwordToCheckSignUp.value !== passwordToCheckConfirm.value ?
                "Les mots de passe sont différents !" : "";
    invalidUsernameSignUp.innerHTML =
        usernameToCheckSignUp.value.length === 0 ?
            "Le champ pseudo est obligatoire !" : "";
    invalidName.innerHTML =
        name.value.length === 0 ?
            "Le champ nom est obligatoire !" : "";
    invalidFirstName.innerHTML =
        firstName.value.length === 0 ?
            "Le champ prénom est obligatoire !" : "";
    if (passwordToCheckSignUp.value === passwordToCheckConfirm.value && passwordToCheckSignUp.value.length !== 0 && passwordToCheckConfirm.value.length !== 0 && usernameToCheckSignUp.value.length !== 0 && name.value.length !== 0 && firstName.value.length !== 0) {
        let usernameSignUp = usernameToCheckSignUp.value
        let passwordSignUp = passwordToCheckSignUp.value
        let data = {
            usernameSignUp: usernameSignUp,
            passwordSignUp: passwordSignUp,
            name: name.value,
            firstName: firstName.value
        }
        fetch("/users/add",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status !== 200) {
                    return response.json()
                } else {
                    window.location = "/auth"
                    return true
                }
            }).then(data => {
            if (data.error === "username") {
                invalidUsernameSignUp.innerHTML = "Login déjà existant !";
            }
        })
        return true
    }
}


