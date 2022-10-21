// noinspection JSUnresolvedVariable

const json = require("./events.json");

module.exports = {
    showEvents: function () {
        return JSON.stringify(json)
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
    }
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}