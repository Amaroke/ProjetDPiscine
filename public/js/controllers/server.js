const events = require('../model/events.js')
const users = require('../model/users.js')
const express = require('express')
const bodyParser = require("body-parser")
const path = require("path");
const app = express()

// Root
app.use(express.static(__dirname + '/../../../public'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

// Login
app.get('/auth', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname + '/../views/authentication.html'));
})

app.post('/auth', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (users.existUser(username)) {
        if (users.validUser(username, password)) {
            res.sendStatus(200)
        } else {
            res.status(401).send({error: "password"})
        }
    } else {
        res.status(401).send({error: "username"})
    }
});


// Events
app.get('/events', (req, res) => {
    let eventsList = events.showEvents()
    if (Object.keys(eventsList).length === 0) {
        res.sendStatus(204)
    } else {
        res.status(200).send(eventsList)
    }
})

app.get('/events/day', (req, res) => {
    let eventsList = events.showEventsDay(new Date(req.query.date))
    if (Object.keys(eventsList).length === 0) {
        res.sendStatus(204)
    } else {
        res.status(200).send(eventsList)
    }
})

app.get('/events/week', (req, res) => {
    let eventsList = events.showEventsWeek(new Date(req.query.date))
    if (Object.keys(eventsList).length === 0) {
        res.sendStatus(204)
    } else {
        res.status(200).send(eventsList)
    }
})

app.get('/events/month', (req, res) => {
    let eventsList = events.showEventsMonth(new Date(req.query.date))
    if (Object.keys(eventsList).length === 0) {
        res.sendStatus(204)
    } else {
        res.status(200).send(eventsList)
    }
})

app.get('/events/year', (req, res) => {
    let eventsList = events.showEventsYear(new Date(req.query.date))
    if (Object.keys(eventsList).length === 0) {
        res.sendStatus(204)
    } else {
        res.status(200).send(eventsList)
    }
})

app.post('/events/add', (req, res) => {
    events.addEvent(req.body)
    res.sendStatus(200)
})

app.delete('/events/delete/all', (req, res) => {
    events.deleteAll()
    res.sendStatus(200)
})


// Users
app.post('/users/add', (req, res) => {
    console.log(req.body)
    let username = req.body.usernameSignUp;
    if (users.existUser(username)) {
        res.status(401).json({error: "username"})
    } else {
        users.addUser(req.body)
        res.sendStatus(200)
    }
})


app.delete('/users/delete/all', (req, res) => {
    users.deleteAll()
    res.sendStatus(200)
})


// Easter egg : https://developer.mozilla.org/fr/docs/Web/HTTP/Status/418
app.get('/coffee', (req, res) => {
    res.sendStatus(418)
})


// Unknown endpoint
app.use((req, res) => {
    res.sendStatus(404);
})


// Server listen 8080
app.listen(8080, () => {
    console.log("Server start !")
})