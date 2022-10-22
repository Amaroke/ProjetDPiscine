const events = require('../model/events.js')
const users = require('../model/users.js')
const express = require('express')
const bodyParser = require("body-parser")
const path = require("path");
const app = express()

// Root
app.use(express.static(__dirname + '/../../../public'));

let urlEncodedParser = bodyParser.urlencoded({extended: false});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/register.html'));
})

// Events
app.get('/events', (req, res) => {
    res.send(events.showEvents())
})

app.get('/events/day', (req, res) => {
    res.send(events.showEventsDay(new Date(req.query.date)))
})

app.get('/events/week', (req, res) => {
    res.send(events.showEventsWeek(new Date(req.query.date)))
})

app.get('/events/month', (req, res) => {
    res.send(events.showEventsMonth(new Date(req.query.date)))
})

app.get('/events/year', (req, res) => {
    res.send(events.showEventsYear(new Date(req.query.date)))
})

app.post('/events/add', urlEncodedParser, (req, res) => {
    events.addEvent(req.body)
    res.redirect("/");
})

// Attention, utiliser avec postman pour reset events.json
app.post('/events/delete/all', (req, res) => {
    events.deleteAll()
    res.redirect("/")
})

app.post('/users/add', urlEncodedParser, (req, res) => {
    let use = req.body.usernameRegister;
    let pswd = req.body.passwordRegister;
    let name = req.body.name;
    let firstName = req.body.firstName;
    users.addUser(use,pswd,name,firstName)
    res.redirect("/login");
})


app.post('/login', urlEncodedParser, (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (users.verif(username, password) === true) {
        res.redirect("/");
    } else {
        //faire un truc plus style
        res.status(404)
    }
});

// Server listen 8080
app.listen(8080, () => {
    console.log("Server start !")
})