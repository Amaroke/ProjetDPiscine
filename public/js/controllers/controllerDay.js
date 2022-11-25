"use strict";

async function fillDay(month, year, day) {

    document.getElementById("lesEventsJour").innerHTML = "";

    let actualDate = new Date(year, month, day)
    let events;
    let currentUser = localStorage.getItem("username");

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
            if(currentUser === event.user){
                switch (event.importance) {
                    case "Normale":
                        document.getElementById("lesEventsJour").innerHTML +=
                            "<li class=\"relative mt-px flex\" style=\"grid-row: " + Math.round(2 + 12 * new Date(event.date).getHours() + (12 * (new Date(event.date).getMinutes() / 60))) + " / span " + 0.2 * event.duration + "\">" +
                            "<a href=\"#\"\n" + "onclick=\"displayEvent(" + event.id + ")\"" + " class=\"group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-300 p-2 text-xs leading-5 hover:bg-blue-400\">\n" +
                            "<p class=\"font-semibold text-blue-600 group-hover:text-blue-800\">" + event.title + "</p>\n" +
                            "<p class=\"text-blue-600 group-hover:text-blue-800\">\n" +
                            "<time datetime=\" " + new Date(event.date).getHours() + "\">" + new Date(event.date).getHours() + " : " + new Date(event.date).getMinutes() + "</time>\n" +
                            "</p>\n" +
                            "</a>" +
                            "</li>";
                        break;
                    case "Important":
                        document.getElementById("lesEventsJour").innerHTML +=
                            "<li class=\"relative mt-px flex\" style=\"grid-row: " + Math.round(2 + 12 * new Date(event.date).getHours() + (12 * (new Date(event.date).getMinutes() / 60))) + " / span " + 0.2 * event.duration + "\">" +
                            "<a href=\"#\"\n" + "onclick=\"displayEvent(" + event.id + ")\"" + " class=\"group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-violet-300 p-2 text-xs leading-5 hover:bg-violet-400\">\n" +
                            "<p class=\"font-semibold text-violet-600 group-hover:text-violet-800\">" + event.title + "</p>\n" +
                            "<p class=\"text-violet-600 group-hover:text-violet-800\">\n" +
                            "<time datetime=\" " + new Date(event.date).getHours() + "\">" + new Date(event.date).getHours() + " : " + new Date(event.date).getMinutes() + "</time>\n" +
                            "</p>\n" +
                            "</a>" +
                            "</li>";
                        break;
                    case "Très important":
                        document.getElementById("lesEventsJour").innerHTML +=
                            "<li class=\"relative mt-px flex\" style=\"grid-row: " + Math.round(2 + 12 * new Date(event.date).getHours() + (12 * (new Date(event.date).getMinutes() / 60))) + " / span " + 0.2 * event.duration + "\">" +
                            "<a href=\"#\"\n" + "onclick=\"displayEvent(" + event.id + ")\"" + " class=\"group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-red-200 p-2 text-xs leading-5 hover:bg-red-300\">\n" +
                            "<p class=\"font-semibold text-red-500 group-hover:text-red-700\">" + event.title + "</p>\n" +
                            "<p class=\"text-red-500 group-hover:text-red-700\">\n" +
                            "<time datetime=\" " + new Date(event.date).getHours() + "\">" + new Date(event.date).getHours() + " : " + new Date(event.date).getMinutes() + "</time>\n" +
                            "</p>\n" +
                            "</a>" +
                            "</li>";
                        break;
                }
            }
        }
    }
}