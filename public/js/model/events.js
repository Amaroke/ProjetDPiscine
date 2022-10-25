"use strict";

// noinspection JSUnresolvedVariable

const json = require("./events.json");
const fs = require('fs')

module.exports = {

    showEvents: function () {
        return json.events
    },

    showEventsDay: function (date) {
        const events = []
        json.events.forEach(function (event) {
            const dateEvent = new Date(event.date)
            if (dateEvent.getDay() === date.getDay() && dateEvent.getMonth() === date.getMonth() && dateEvent.getFullYear() === date.getFullYear()) {
                events.push(event)
            }
        })
        return events
    },

    showEventsWeek: function (date) {
        const events = []
        json.events.forEach(function (event) {
            const dateEvent = new Date(event.date)
            if (dateEvent.getFullYear() === date.getFullYear() && getWeekNumber(dateEvent) === getWeekNumber(date)) {
                events.push(event)
            }
        })
        return events
    },

    showEventsMonth: function (date) {
        const events = []
        json.events.forEach(function (event) {
            const dateEvent = new Date(event.date)
            if (dateEvent.getMonth() === date.getMonth() && dateEvent.getFullYear() === date.getFullYear()) {
                events.push(event)
            }
        })
        return events
    },

    showEventsYear: function (date) {
        const events = []
        json.events.forEach(function (event) {
            const dateEvent = new Date(event.date)
            if (dateEvent.getFullYear() === date.getFullYear()) {
                events.push(event)
            }
        })
        return events
    },

    existingDate: function(date, duration) {
        let dateDebut = new Date(date)
        let dateFin = new Date(dateDebut.getTime() + duration*60000);
        json.events.forEach(function (event) {
            let dateEventDebut = new Date(event.date)
            let dateEventFin = new Date(dateEventDebut.getTime() + event.duration*60000);
            //TODO Problème d'UTC et variable incorrecte
            let superimposed = (dateDebut < dateEventDebut && dateFin > dateEventDebut) || (dateDebut < dateEventFin && dateFin > dateEventFin)
            if (superimposed) {
                return true
            }
        })
        return false
    },

    addEvent: function (req) {
        let newId = 0
        if (json.events.length > 0) {
            newId = json.events[json.events.length - 1].id + 1
        }
        let event = {
            "user": req.user,
            "id": newId,
            "title": req.title,
            "date": new Date(req.date),
            "duration": req.duration,
            "description": req.description
        }
        json.events.push(event)
        fs.writeFileSync("./public/js/model/events.json", JSON.stringify(json))
    },

    deleteAll: function () {
        fs.writeFileSync("./public/js/model/events.json", '{"events":[]}')
    }

}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}