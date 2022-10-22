const events = require('../model/events.js')
const users = require('../model/users.js')
const express = require('express')
const bodyParser = require("body-parser")
const path = require("path");
const app = express()
const urlEncodedParser = bodyParser.urlencoded({extended: false});

// Root
app.use(express.static(__dirname + '/../../../public'));


// Login
app.get('/login', (req, res) => {
    // TODO CODE HTTP
    res.sendFile(path.join(__dirname + '/../views/login.html'));
})

app.post('/login', urlEncodedParser, (req, res) => {
    // TODO CODE HTTP
    let username = req.body.username;
    let password = req.body.password;
    if (users.verif(username, password) === true) {
        res.redirect("/");
    } else {
        //faire un truc plus style
        res.status(404)
    }
});


// Events
app.get('/events', (req, res) => {
    let eventsList = events.showEvents()
    if(Object.keys(eventsList).length === 0) {
        res.status(204)
    } else {
        res.status(200)
    }
    res.send(eventsList)
})

app.get('/events/day', (req, res) => {
    let eventsList = events.showEventsDay(new Date(req.query.date))
    if(Object.keys(eventsList).length === 0) {
        res.status(204)
    } else {
        res.status(200)
    }
    res.send(eventsList)
})

app.get('/events/week', (req, res) => {
    let eventsList = events.showEventsWeek(new Date(req.query.date))
    if(Object.keys(eventsList).length === 0) {
        res.status(204)
    } else {
        res.status(200)
    }
    res.send(eventsList)
})

app.get('/events/month', (req, res) => {
    let eventsList = events.showEventsMonth(new Date(req.query.date))
    if(Object.keys(eventsList).length === 0) {
        res.status(204)
    } else {
        res.status(200)
    }
    res.send(eventsList)
})

app.get('/events/year', (req, res) => {
    let eventsList = events.showEventsYear(new Date(req.query.date))
    if(Object.keys(eventsList).length === 0) {
        res.status(204)
    } else {
        res.status(200)
    }
    res.send(eventsList)
})

app.post('/events/add', urlEncodedParser, (req, res) => {
    events.addEvent(req.body)
    res.status(200)
    res.redirect("/");
})

app.delete('/events/delete/all', (req, res) => {
    events.deleteAll()
    res.status(200)
    res.redirect("/")
})


// Users
app.post('/users/add', urlEncodedParser, (req, res) => {
    //TODO CODE HTTP + PASSER BODY EN PARAM
    let use = req.body.usernameRegister;
    let pswd = req.body.passwordRegister;
    let name = req.body.name;
    let firstName = req.body.firstName;
    users.addUser(use, pswd, name, firstName)
    res.redirect("/login");
})


// Easter-eggs : https://developer.mozilla.org/fr/docs/Web/HTTP/Status/418
app.get('/coffee', (req, res) => {
    res.status(418)
    res.send()
})


// Unknown endpoint
app.use((req, res) => {
    res.status(404);
    res.json({
        error: "Page not found"
    });
})


// Server listen 8080
app.listen(8080, () => {
    console.log("Server start !")
})