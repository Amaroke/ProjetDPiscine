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
    res.sendFile(path.join(__dirname + '/../views/login.html'));
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

app.post('/events/add', (req, res) => {
    let event = {
        "user" : req.query.user,
        "title" : req.query.title,
        "date" : new Date(req.query.date),
        "duration" : req.query.duration
    }
    events.addEvent(event)
    res.sendFile(path.join(__dirname + '/../../index.html'));
})

app.post('/login', urlEncodedParser, (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (users.verif(username, password) === true) {
        res.sendFile(path.join(__dirname + '/../../index.html'));
    } else {
        //faire un truc plus style
        res.status(401)
    }
});

// Server listen 8080
app.listen(8080, () => {
    console.log("Server start !")
})