const json = require("./users.json");
const fs = require("fs");

module.exports = {

    existUser: function (loginP) {
        let response = false;
        json.users.forEach(function (user) {
            const login = user.login
            if (login === loginP) {
                response = true;
            }
        })
        return response
    },

    validUser: function (loginP, passwordP) {
        let response = false;
        json.users.forEach(function (user) {
            const login = user.login
            const password = user.password
            if (login === loginP && password === passwordP) {
                response = true
            }
        })
        return response
    },

    addUser: function (req) {
        let user = {
            "login": req.usernameSignUp,
            "password": req.passwordSignUp,
            "name": req.name,
            "first_name": req.firstName,
        }
        json.users.push(user)
        fs.writeFileSync("./public/js/model/users.json", JSON.stringify(json))
    },

    deleteAll: function () {
        fs.writeFileSync("./public/js/model/users.json", '{"users":[]}')
    }

}