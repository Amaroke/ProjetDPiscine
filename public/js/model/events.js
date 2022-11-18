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

    existingDate: function (date, duration) {
        let newDateDebut = new Date(date)
        let newDateFin = new Date(newDateDebut.getTime() + duration * 60000);
        let existing = false;
        json.events.forEach(function (event) {
            let dateEventDebut = new Date(event.date);
            let dateEventFin = new Date(dateEventDebut.getTime() + event.duration * 60000);
            let superimposed = (newDateDebut > dateEventDebut && newDateDebut < dateEventFin) ||
                (newDateFin > dateEventDebut && newDateFin < dateEventFin) ||
                (newDateDebut > dateEventDebut && newDateFin < dateEventFin) ||
                (newDateDebut <= dateEventDebut && newDateFin >= dateEventFin);
            if (superimposed) {
                existing = true;
            }
        })
        return existing;
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
    },

    eventById: function (id) {
        let rep = null;
        json.events.forEach(function (event) {
            if (parseInt(event.id) === parseInt(id)) {
                rep = event;
            }
        })
        return rep;
    },

    modifyEvent: function (id, infos) {
        let rep = false;
        json.events.forEach(function (event) {
            if (parseInt(event.id) === parseInt(id)) {
                event.title = infos.title;
                event.date = infos.date;
                event.duration = infos.duration;
                event.description = infos.description;
                fs.writeFileSync("./public/js/model/events.json", JSON.stringify(json));
                rep = true;
            }
        })
        return rep;
    },

    deleteEvent: function (id) {
        let rep = false;
        json.events.forEach(function (event) {
            if (parseInt(event.id) === parseInt(id)) {
                json.events.splice(json.events.indexOf(event), 1);
                fs.writeFileSync("./public/js/model/events.json", JSON.stringify(json));
                rep = true;
            }
        })
        return rep;
    }
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}