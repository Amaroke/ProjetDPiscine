// noinspection JSUnresolvedVariable

module.exports = {
    showEvents: function () {
        const json = require('./events.json')
        return JSON.stringify(json)
    },
    showEventsDay: function (date) {
        const json = require('./events.json')
        const strEvents = JSON.stringify(json)
        const objEvents = JSON.parse(strEvents)
        const events = []
        objEvents.events.forEach(function (event) {
            const dateEvent = new Date(event.date)
            if (dateEvent.getDay() === date.getDay() && dateEvent.getMonth() === date.getMonth() && dateEvent.getFullYear() === date.getFullYear()) {
                events.push(event)
            }
        })
        return events
    },
    showEventsMonth: function (date) {
        const json = require('./events.json')
        const strEvents = JSON.stringify(json)
        const objEvents = JSON.parse(strEvents)
        const events = []
        objEvents.events.forEach(function (event) {
            const dateEvent = new Date(event.date)
            if (dateEvent.getMonth() === date.getMonth() && dateEvent.getFullYear() === date.getFullYear()) {
                events.push(event)
            }
        })
        return events
    },
    showEventsYear: function (date) {
        const json = require('./events.json')
        const strEvents = JSON.stringify(json)
        const objEvents = JSON.parse(strEvents)
        const events = []
        objEvents.events.forEach(function (event) {
            const dateEvent = new Date(event.date)
            if (dateEvent.getFullYear() === date.getFullYear()) {
                events.push(event)
            }
        })
        return events
    }
}