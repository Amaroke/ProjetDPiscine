const events = require('../model/events.js')
const express = require('express')
const app = express()

app.get('/events', (req, res) => {
    res.send(events.showEvents())
})

app.get('/events/day', (req, res) => {
    res.send(events.showEventsDay(new Date(req.query.date)))
})

app.get('/events/month', (req, res) => {
    res.send(events.showEventsMonth(new Date(req.query.date)))
})

app.get('/events/year', (req, res) => {
    res.send(events.showEventsYear(new Date(req.query.date)))
})

app.listen(8080, () => {
    console.log("Server start !")
})