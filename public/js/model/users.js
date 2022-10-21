const json = require("./users.json");
module.exports = {
    showUsers: function () {
        return JSON.stringify(json)
    },
    verif: function (loginP, passwordP){
        const objUsers = require('./users.json')
        let reponse = false;
        objUsers.users.forEach(function (user) {
            const login = user.login
            const password = user.password
            if (login === loginP && password === passwordP) {
                reponse = true;
            }
        })
        return reponse
    }
}