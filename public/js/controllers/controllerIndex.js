// noinspection DuplicatedCode

"use strict";

// Modal add event
function verificationFormAddEvent() {
    let titleToCheck = document.getElementById("title")
    let dateToCheck = document.getElementById("date")
    let durationToCheck = document.getElementById("duration")
    let user = localStorage.getItem("username").toString()
    let description = document.getElementById("description")
    let invalidTitle = document.getElementById("invalidTitle")
    let invalidDate = document.getElementById("invalidDate")
    let invalidDuration = document.getElementById("invalidDuration")
    invalidTitle.innerHTML = titleToCheck.value.length === 0 ? "Il faut renseigner un nom !" : ""
    invalidDate.innerHTML = dateToCheck.value.length === 0 ? "Il faut renseigner une date !" : ""
    invalidDuration.innerHTML = durationToCheck.value.length === 0 ? "Il faut renseigner une durée !" : ""
    if (titleToCheck.value.length !== 0 &&
        dateToCheck.value.length !== 0 &&
        durationToCheck.value.length !== 0) {
        let data = {
            user: user,
            title: titleToCheck.value,
            date: dateToCheck.value,
            duration: durationToCheck.value,
            description: description.value
        }
        fetch('/events/add',
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status !== 200) {
                    return response.json()
                } else {
                    window.location = "/"
                    return true
                }
            }).then(data => {
            if (data.error === "date") {
                invalidDate.innerHTML = "Il y a déjà un évènement sur cette date !";
            }
        })
        return true
    }
}

let currentView = "week";
let currentMonth = new Date().getMonth() + 1;
let currentDay = new Date().getDate();
let currentYear = new Date().getFullYear();
let firstDayWeek;
let lastDayWeek;

// DarkTheme
window.addEventListener("load", function () {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById("body").classList.remove('whiteScrollbar');
    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById("body").classList.add('whiteScrollbar');
    }

    let nightMode = document.getElementById("nightMode");
    let nbClick = 0;

    nightMode.addEventListener("click", function () {
        nbClick++;
        if (nbClick % 2 !== 0) {
            if (localStorage.theme === 'dark') {
                localStorage.theme = 'light';
                document.documentElement.classList.remove('dark');
                document.getElementById("body").classList.add('whiteScrollbar');
            } else {
                localStorage.theme = 'dark';
                document.documentElement.classList.add('dark');
                document.getElementById("body").classList.remove('whiteScrollbar');
            }
        }
    });

    loadHTML("./js/views/" + currentView + ".html");
    let menuButton = document.getElementById("menu-button");
    let selectView = document.getElementById("selectView");
    let month = document.getElementById("monthView");
    let week = document.getElementById("weekView");
    let day = document.getElementById("dayView");
    let next = document.getElementById("next");
    let prev = document.getElementById("prev");
    let today = document.getElementById("today");
    let titleHead = document.getElementById("titleHead");
    let modalNewEvent = document.getElementById("modalNewEvent");
    let addEventButton = document.getElementById("addEventButton");
    let bgModalNewEvent = document.getElementById("bgModalNewEvent");
    let annulerEvent = document.getElementById("cancelAdd");
    let annulerDisplayEvent = document.getElementById("annulerDisplayEvent");
    let modalDisplayEvent = document.getElementById("modalDisplayEvent");

    toDayWeek();

    annulerEvent.addEventListener("click", function () {
        modalNewEvent.classList.add("hidden");
    });
    annulerDisplayEvent.addEventListener("click", function () {
        modalDisplayEvent.classList.add("hidden");
    });
    bgModalNewEvent.addEventListener("click", function () {
        modalNewEvent.classList.add("hidden");
    });
    addEventButton.addEventListener("click", function () {
        modalNewEvent.classList.remove("hidden");
    });
    next.addEventListener("click", function () {
        switch (currentView) {
            case "week":
                nextWeek();
                fillWeek(currentMonth === 1 ? 12 : currentMonth - 1, currentYear, firstDayWeek).then(() => {
                });
                break;
            case "month":
                nextMonth();
                fillDays(currentMonth === 1 ? 12 : currentMonth - 1, currentYear).then(() => {
                });
                break;
            case "day":
                nextDay();
                fillDay(currentMonth === 1 ? 11 : currentMonth - 1, currentYear, currentDay).then(() => {
                });
                break;
        }
    });
    prev.addEventListener("click", function () {
        switch (currentView) {
            case "week":
                prevWeek();
                fillWeek(currentMonth === 1 ? 12 : currentMonth - 1, currentYear, firstDayWeek).then(() => {
                });
                break;
            case "month":
                prevMonth();
                fillDays(currentMonth === 1 ? 12 : currentMonth - 1, currentYear).then(() => {
                });
                break;
            case "day":
                prevDay();
                fillDay(currentMonth === 1 ? 11 : currentMonth - 1, currentYear, currentDay).then(() => {
                });
                break;
        }
    });

    today.addEventListener("click", function () {
        if (currentView === "week") {
            toDayWeek();
            fillWeek(currentMonth === 1 ? 12 : currentMonth - 1, currentYear, firstDayWeek).then(() => {
            });
        } else if (currentView === "month") {
            toDayMonth();
            fillDays(currentMonth === 1 ? 12 : currentMonth - 1, currentYear).then(() => {
            });
        } else if (currentView === "day") {
            toDayDay();
            fillDay(currentMonth === 1 ? 11 : currentMonth - 1, currentYear, currentDay).then(() => {
            });
        }
    });
    month.addEventListener("click", function () {
        loadHTML("./js/views/month.html");
        selectView.classList.add("hidden");
        currentView = "month";
        changeTitleHead();
        menuButton.innerHTML = "Mois" +
            "<svg class=\"ml-2 h-5 w-5 text-gray-400\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" aria-hidden=\"true\">\n" +
            "<path fill-rule=\"evenodd\" d=\"M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z\" clip-rule=\"evenodd\" />\n" +
            "</svg>";
    });
    week.addEventListener("click", function () {
        loadHTML("./js/views/week.html");
        titleHead.innerHTML = "Lun " + firstDayWeek.getUTCDate() + "-" + "Dim " + lastDayWeek.getUTCDate();
        selectView.classList.add("hidden");
        currentView = "week";
        changeTitleHead();
        menuButton.innerHTML = "Semaine" +
            "<svg class=\"ml-2 h-5 w-5 text-gray-400\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" aria-hidden=\"true\">\n" +
            "<path fill-rule=\"evenodd\" d=\"M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z\" clip-rule=\"evenodd\" />\n" +
            "</svg>";
    });
    day.addEventListener("click", function () {
        loadHTML("./js/views/day.html");
        selectView.classList.add("hidden");
        currentView = "day";
        changeTitleHead();
        menuButton.innerHTML = "Jour" +
            "<svg class=\"ml-2 h-5 w-5 text-gray-400\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" aria-hidden=\"true\">\n" +
            "<path fill-rule=\"evenodd\" d=\"M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z\" clip-rule=\"evenodd\" />\n" +
            "</svg>";
    });
    menuButton.addEventListener("click", function () {
        selectView.classList.contains("hidden") ? selectView.classList.remove("hidden") : selectView.classList.add("hidden");
    });
});

function loadHTML(file) {
    fetch(file)
        .then(response => response.text())
        .then(text => {
            document.getElementById('display').innerHTML = text
            switch (file) {
                case "./js/views/month.html":
                    fillDays(currentMonth === 1 ? 11 : currentMonth - 1, currentYear).then(() => {
                    });
                    break;
                case "./js/views/week.html":
                    fillWeek(currentMonth === 1 ? 12 : currentMonth - 1, currentYear, firstDayWeek).then(() => {
                    });
                    break;
                case "./js/views/day.html":
                    fillDay(currentMonth === 1 ? 11 : currentMonth - 1, currentYear, currentDay).then(() => {
                    });
                    break;
            }
        });
}

function nextWeek() {
    firstDayWeek.setDate(firstDayWeek.getDate() + 7);
    lastDayWeek.setDate(lastDayWeek.getDate() + 7);
    changeTitleHead();
}

function prevWeek() {
    firstDayWeek.setDate(firstDayWeek.getDate() - 7);
    lastDayWeek.setDate(lastDayWeek.getDate() - 7);
    changeTitleHead();
}

function nextMonth() {
    if (currentMonth === 12) {
        currentMonth = 1;
        currentYear++;
    } else {
        currentMonth++;
    }
    changeTitleHead();
}

function prevMonth() {
    if (currentMonth === 1) {
        currentMonth = 12;
        currentYear--;
    } else {
        currentMonth--;
    }
    changeTitleHead();
}

function nextDay() {
    currentDay++;
    changeTitleHead();
}

function prevDay() {
    currentDay--;
    changeTitleHead();
}

function toDayWeek() {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    firstDayWeek = new Date(date.setDate(diff));
    lastDayWeek = new Date()
    lastDayWeek.setDate(firstDayWeek.getDate() + 6);
    changeTitleHead();
}

function toDayMonth() {
    currentMonth = new Date().getMonth() + 1;
    currentYear = new Date().getFullYear();
    changeTitleHead();
}

function toDayDay() {
    currentDay = new Date().getDate();
    changeTitleHead();
}

function changeTitleHead() {
    switch (currentView) {
        case "month":
            let mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
            document.getElementById("titleHead").innerHTML = mois[currentMonth - 1] + " " + currentYear
            break;
        case "week":
            document.getElementById("titleHead").innerHTML = "Lun " + firstDayWeek.getUTCDate() + " - " + "Dim " + lastDayWeek.getUTCDate();
            break;
        case "day":
            document.getElementById("titleHead").innerHTML = "Day " + currentDay;
            break;
    }
}

async function displayEvent(id) {
    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.remove("hidden");
    document.getElementById("buttonModifyEvent").addEventListener('click', function () {
        modifyEvent(id)
    });
    document.getElementById("buttonDeleteEvent").addEventListener('click', function () {
        deleteEvent(id)
    });
    let infos = await getEvent(id);
    let title = document.getElementById("titleDisplayEvent");
    let description = document.getElementById("descriptionDisplayEvent");
    let date = document.getElementById("dateDisplayEvent");
    let duration = document.getElementById("durationDisplayEvent");
    title.value = infos.title;
    description.value = infos.description;

    Number.prototype.AddZero = function (b, c) {
        let l = (String(b || 10).length - String(this).length) + 1;
        return l > 0 ? new Array(l).join(c || '0') + this : this;
    }

    let d = new Date(infos.date);
    date.value = [d.getFullYear(), (d.getMonth() + 1).AddZero(), d.getDate().AddZero()].join('-') + 'T' + [d.getHours().AddZero(), d.getMinutes().AddZero()].join(':');
    duration.value = infos.duration;
}

async function getEvent(id) {
    return fetch("/event/" + id,
        {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
        })
}

function modifyEvent(id) {
    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.add("hidden");
    let data = {
        title: document.getElementById("titleDisplayEvent").value,
        description: document.getElementById("descriptionDisplayEvent").value,
        date: document.getElementById("dateDisplayEvent").value,
        duration: document.getElementById("durationDisplayEvent").value,
    }
    fetch("/modifyEvent/" + id,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        }).then(r => r.json());
    loadHTML("./js/views/"+currentView+".html");
}

function deleteEvent(id) {
    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.add("hidden");
    fetch("/deleteEvent/" + id,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }).then(r => r.json());
    loadHTML("./js/views/"+currentView+".html");
}