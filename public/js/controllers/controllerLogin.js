// noinspection JSUnresolvedVariable
const axios = require('axios')


    function axiosCall() {
        axios.post('/login', {
            username: document.getElementById("username").innerText,
            password: document.getElementById("password").innerText
        })
            .then(function (problem) {
                if(problem.toString() === "username"){
                    lespanUsername.innerHTML = "Pseudo incorrect !";
                }else if(problem.toString() === "password") {
                    lespanPassword.innerHTML = "Votre mot de passe est incorrect !";
                }
            })
    }

export { axiosCall };