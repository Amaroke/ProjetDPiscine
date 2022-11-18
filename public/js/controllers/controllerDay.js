"use strict";

async function fillDay(month, year, day) {

    document.getElementById("lesEventsJour").innerHTML = "";

    let actualDate = new Date(year, month, day)
    let events;

    await fetch("/events/day?date=" + actualDate.toJSON(),
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

    if (events != null) {
        for (let event of events) {
            document.getElementById("lesEventsJour").innerHTML +=
                "<li onclick=\"displayEvent(" + event.id + ")\" class=\"relative mt-px flex\" style=\"grid-row: " + Math.round(2 + 12 * new Date(event.date).getHours() + (12 * (new Date(event.date).getMinutes() / 60))) + " / span " + 0.2 * event.duration + "\">" +
                "<a class=\"cursor-pointer group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100\">\n" +
                "<p class=\" font-semibold text-blue-700\">" + event.title + "</p>\n" +
                "<p class=\"text-blue-500 group-hover:text-blue-700\">\n" +
                "<time datetime=\" " + new Date(event.date).getHours() + "\">" + new Date(event.date).getHours() + " : " + new Date(event.date).getMinutes() + "</time>\n" +
                "</p>\n" +
                "</a>\n" +
                "</li>";
        }
    }
}