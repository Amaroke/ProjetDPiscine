"use strict";

async function fillWeek(month, year, firstDayWeek) {

    let actualDate = firstDayWeek
    let events;

    await fetch("/events/week?date=" + actualDate.toJSON(),
        {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
        }).then(data => {
            events = data
        })


    actualDate = new Date(firstDayWeek)
    for (let i = 1; i <= 7; ++i) {
        document.getElementById("day" + i).innerHTML = actualDate.getUTCDate().toString();
        actualDate.setDate(actualDate.getDate() + 1)
    }

    actualDate = new Date(firstDayWeek)
    document.getElementById("events").innerHTML = ""
    for (let i = 1; i <= 7; ++i) {
        if (events != null) {
            for (const event of events) {
                if (new Date(event.date).getUTCDate() === (actualDate.getUTCDate())) {
                    document.getElementById("events").innerHTML +=
                        "<li class=\"relative mt-px flex sm:col-start-" + i + "\" style=\"grid-row: " + Math.round(2 + 12 * new Date(event.date).getHours() + (12 * (new Date(event.date).getMinutes() / 60))) + " / span " + 0.2 * event.duration + "\">" +
                        "<a href=\"#\"\n" + "onclick=\"displayEvent(" + event.id + ")\"" + " class=\"group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200\">\n" +
                        "<p class=\"order-1 font-semibold text-gray-700\">" + event.title + "</p>\n" +
                        "<p class=\"text-gray-500 group-hover:text-gray-700\">\n" +
                        "</p>\n" +
                        "</a>" +
                        "</li>"
                    ;
                }
            }
        }
        actualDate.setDate(actualDate.getDate() + 1)
    }
}