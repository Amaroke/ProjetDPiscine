"use strict";

async function fillDays(month, year) {

    let events;
    let prevMonth = month === 0 ? 11 : month - 1
    let actualMonth = month
    let prevYear = prevMonth === 11 ? year - 1 : year
    let actualYear = year
    let prevDate = new Date(prevYear, prevMonth, 1)
    let actualDate = new Date(actualYear, actualMonth, 1)
    let prevMonthNbDays = getNbJours(prevDate)
    let actualMonthNbDays = getNbJours(actualDate)
    let firstDay = actualDate.getDay()
    let currentUser = localStorage.getItem("username");

    await fetch("/events/month?date=" + actualDate.toJSON(),
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

    for (let i = 0; i < firstDay - 1; ++i) {
        document.getElementById("box" + i).innerHTML = "";
        document.getElementById("box" + i).innerHTML = (prevMonthNbDays - firstDay + i + 2).toString()
        document.getElementById("box" + i).className = " relative dark:bg-gray-800 bg-gray-50 py-2 px-3 text-gray-500"
    }
    for (let i = firstDay - 1; i < actualMonthNbDays + firstDay - 1; ++i) {
        document.getElementById("box" + i).innerHTML = "";
        document.getElementById("box" + i).innerHTML = (i + 2 - firstDay).toString()
        document.getElementById("box" + i).className = " relative bg-white dark:bg-gray-900 py-2 px-3 overflow-auto max-h-24 h-24 whiteScrollbar2 dark:darkScrollbar"
        if (events != null) {
            for (const event of events) {
                if(currentUser === event.user){
                    if (new Date(event.date).getDate() === (i + 2 - firstDay)) {
                        let dateCurrent = new Date(event.date)
                        switch (event.importance) {
                            case "Normale":
                                document.getElementById("box" + i).innerHTML +=
                                    "<ol class=\"mt-2 px-2 py-0.5 rounded-lg bg-blue-300 dark:hover:bg-blue-400 hover:bg-blue-400\"><li><a href=\"javascript:void(0)\" onclick=\"displayEvent(" + event.id + ")\"" + " class=\"group flex\">" +
                                    "<p class=\"flex-auto truncate font-medium text-blue-600 dark:text-blue-800 group-hover:text-blue-800\">" +
                                    event.title + '</p>' +
                                    "<time dateTime=\"\" class=\"ml-3 hidden flex-none text-blue-600 group-hover:text-blue-800 xl:block\">" +
                                    dateCurrent.getHours() + "h" + (dateCurrent.getMinutes() > 10 ? dateCurrent.getMinutes() : ("0" + dateCurrent.getMinutes())) + " </time></a></li></ol>"
                                break;
                            case "Important":
                                document.getElementById("box" + i).innerHTML +=
                                    "<ol class=\"mt-2 px-2 py-0.5 rounded-lg bg-violet-300 dark:hover:bg-violet-400 hover:bg-violet-400\"><li><a href=\"javascript:void(0)\" onclick=\"displayEvent(" + event.id + ")\"" + " class=\"group flex\">" +
                                    "<p class=\"flex-auto truncate font-medium text-violet-600 dark:text-violet-800 group-hover:text-violet-800\">" +
                                    event.title + '</p>' +
                                    "<time dateTime=\"\" class=\"ml-3 hidden flex-none text-violet-600 group-hover:text-violet-800 xl:block\">" +
                                    dateCurrent.getHours() + "h" + (dateCurrent.getMinutes() > 10 ? dateCurrent.getMinutes() : ("0" + dateCurrent.getMinutes())) + " </time></a></li></ol>"
                                break;
                            case "Très important":
                                document.getElementById("box" + i).innerHTML +=
                                    "<ol class=\"mt-2 px-2 py-0.5 rounded-lg bg-red-200 dark:hover:bg-red-300 hover:bg-red-300\"><li><a href=\"javascript:void(0)\" onclick=\"displayEvent(" + event.id + ")\"" + " class=\"group flex\">" +
                                    "<p class=\"flex-auto truncate font-medium text-red-600 dark:text-red-800 group-hover:text-red-800\">" +
                                    event.title + '</p>' +
                                    "<time dateTime=\"\" class=\"ml-3 hidden flex-none text-red-600 group-hover:text-red-800 xl:block\">" +
                                    dateCurrent.getHours() + "h" + (dateCurrent.getMinutes() > 10 ? dateCurrent.getMinutes() : ("0" + dateCurrent.getMinutes())) + " </time></a></li></ol>"
                                break;
                        }
                    }
                }
            }
        }
    }
    for (let i = actualMonthNbDays + firstDay - 1; i < 42; ++i) {
        document.getElementById("box" + i).innerHTML = (i + 2 - firstDay - actualMonthNbDays).toString()
        document.getElementById("box" + i).className += " relative dark:bg-gray-800 bg-gray-50 py-2 px-3 text-gray-500"
    }
}

function getNbJours(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, -1).getDate() + 1;
}