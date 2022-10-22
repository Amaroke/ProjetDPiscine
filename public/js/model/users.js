const json = require("./users.json");
const fs = require("fs");
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
    },addUser: function (use,pswd,name,firstName){
        let user = {
            "login" : use,
            "password": pswd,
            "name" : name,
            "first_name" : firstName,
        }
        json.users.push(user)
        fs.writeFileSync("./public/js/model/users.json", JSON.stringify(json))
    }

}