const events = require('../model/events.js')
const express = require('express')
const app = express()

// Racine du site
app.use(express.static(__dirname+'/../../../public'));

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

// Server listen 8080
app.listen(8080, () => {
    console.log("Server start !")
})