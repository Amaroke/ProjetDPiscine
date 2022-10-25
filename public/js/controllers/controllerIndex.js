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

// TODO FAUT TRIER tout ce qui a en dessous

let curentView = "week";
let currentMonth = new Date().getMonth() + 1;
let currentDay = new Date().getDate();
let currentYear = new Date().getFullYear();

let firstdayWeek;
let lastdayWeek;


window.addEventListener("load", function () {
    loadHTML("./js/views/week.html");
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

    setUpWeek();

    annulerEvent.addEventListener("click", function () {
        modalNewEvent.classList.add("hidden");
    });
    bgModalNewEvent.addEventListener("click", function () {
        modalNewEvent.classList.add("hidden");
    });
    addEventButton.addEventListener("click", function () {
        modalNewEvent.classList.remove("hidden");
    });
    next.addEventListener("click", function () {
        switch (curentView) {
            case "week":
                nextWeek();
                break;
            case "month":
                nextMonth();
                break;
            case "day":
                nextDay();
                break;
        }
    });
    prev.addEventListener("click", function () {
        switch (curentView) {
            case "week":
                prevWeek();
                break;
            case "month":
                prevMonth();
                break;
            case "day":
                prevDay();
                break;
        }
    });
    today.addEventListener("click", function () {
        if (curentView === "week") {
            toDayWeek();
        } else if (curentView === "month") {
            toDayMonth();
        } else if (curentView === "day") {
            toDayDay();
        }
    });
    month.addEventListener("click", function () {
        loadHTML("./js/views/month.html");
        selectView.classList.add("hidden");
        curentView = "month";
        changeTitleHead();
        menuButton.innerHTML = "Mois" +
            "<svg class=\"ml-2 h-5 w-5 text-gray-400\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" aria-hidden=\"true\">\n" +
            "<path fill-rule=\"evenodd\" d=\"M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z\" clip-rule=\"evenodd\" />\n" +
            "</svg>";
    });
    week.addEventListener("click", function () {
        loadHTML("./js/views/week.html");
        titleHead.innerHTML = "Lun " + firstdayWeek.getUTCDate() + "-" + "Dim " + lastdayWeek.getUTCDate();
        selectView.classList.add("hidden");
        curentView = "week";
        changeTitleHead();
        menuButton.innerHTML = "Semaine" +
            "<svg class=\"ml-2 h-5 w-5 text-gray-400\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" aria-hidden=\"true\">\n" +
            "<path fill-rule=\"evenodd\" d=\"M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z\" clip-rule=\"evenodd\" />\n" +
            "</svg>";


    });
    day.addEventListener("click", function () {
        loadHTML("./js/views/day.html");
        selectView.classList.add("hidden");
        curentView = "day";
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
        .then(text => document.getElementById('display').innerHTML = text);
}

function setUpWeek() {
    let curr = new Date(); // get current date
    let first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    firstdayWeek = new Date(curr.setDate(first));
    lastdayWeek = new Date(curr.setDate(last));
    changeTitleHead();
}

function nextWeek() {
    firstdayWeek.setDate(firstdayWeek.getDate() + 7);
    lastdayWeek.setDate(lastdayWeek.getDate() + 7);

    changeTitleHead();
}

function prevWeek() {
    firstdayWeek.setDate(firstdayWeek.getDate() - 7);
    lastdayWeek.setDate(lastdayWeek.getDate() - 7);

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
    let curr = new Date(); // get current date
    let first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    firstdayWeek = new Date(curr.setDate(first));
    lastdayWeek = new Date(curr.setDate(last));
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
    switch (curentView) {
        case "month":
            switch (currentMonth) {
                case 1:
                    titleHead.innerHTML = "Janvier" + " " + currentYear;
                    break;
                case 2:
                    titleHead.innerHTML = "Février" + " " + currentYear;
                    break;
                case 3:
                    titleHead.innerHTML = "Mars" + " " + currentYear;
                    break;
                case 4:
                    titleHead.innerHTML = "Avril" + " " + currentYear;
                    break;
                case 5:
                    titleHead.innerHTML = "Mai" + " " + currentYear;
                    break;
                case 6:
                    titleHead.innerHTML = "Juin" + " " + currentYear;
                    break;
                case 7:
                    titleHead.innerHTML = "Juillet" + " " + currentYear;
                    break;
                case 8:
                    titleHead.innerHTML = "Aout" + " " + currentYear;
                    break;
                case 9:
                    titleHead.innerHTML = "Septembre" + " " + currentYear;
                    break;
                case 10:
                    titleHead.innerHTML = "Octobre" + " " + currentYear;
                    break;
                case 11:
                    titleHead.innerHTML = "Novembre" + " " + currentYear;
                    break;
                case 12:
                    titleHead.innerHTML = "Decembre" + " " + currentYear;
                    break;
            }
            break;
        case "week":
            titleHead.innerHTML = "Lun " + firstdayWeek.getUTCDate() + " - " + "Dim " + lastdayWeek.getUTCDate();
            break;
        case "day":
            titleHead.innerHTML = "Day " + currentDay;
            break;
    }
}

async function displayEvent(id) {
    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.remove("hidden");
    document.getElementById("buttonModifyEvent").addEventListener('click', function(){modifyEvent(id)});
    document.getElementById("buttonDeleteEvent").addEventListener('click', function(){deleteEvent(id)});
    let infos = await getEvent(id);
    let title = document.getElementById("titleDisplayEvent");
    let description = document.getElementById("descriptionDisplayEvent");
    let date = document.getElementById("dateDisplayEvent");
    let duree = document.getElementById("durationDisplayEvent");
    title.value = infos.title;
    description.value = infos.description;

    Number.prototype.AddZero= function(b,c){
        let  l= (String(b|| 10).length - String(this).length)+1;
        return l> 0? new Array(l).join(c|| '0')+this : this;
    }

    let d = new Date(infos.date);
    date.value = [d.getFullYear(), (d.getMonth() + 1).AddZero(), d.getDate().AddZero()].join('-') + 'T' + [d.getHours().AddZero(), d.getMinutes().AddZero()].join(':');
    duree.value = infos.duration;
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

function closeModalDisplayEvent(){
    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.add("hidden");
}

function modifyEvent(id){
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
}

function deleteEvent(id){
    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.add("hidden");
    fetch("/deleteEvent/" + id,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }).then(r => r.json());
}

//document.getElementById("user").value = localStorage.getItem("username")