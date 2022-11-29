// noinspection DuplicatedCode,InfiniteRecursionJS

"use strict";

// Modal add event
function verificationFormAddEvent() {
    let titleToCheck = document.getElementById("title")
    let dateToCheck = document.getElementById("date")
    let durationToCheck = document.getElementById("duration")
    let user = localStorage.getItem("username").toString()
    let description = document.getElementById("description")
    let importance = document.getElementById("importanceSelectCreate")
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
            description: description.value,
            importance: importance.innerText
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
    let userConnected = false;
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === "username") {
            userConnected = true;
        }
    }



    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById("body").classList.remove('whiteScrollbar');
        localStorage.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById("body").classList.add('whiteScrollbar');
        document.getElementById("hide-checkbox").checked = true;
        localStorage.theme = 'light';
    }


    if (userConnected === true) {

        let nightMode = document.getElementById("nightMode");
        let nbClick = 0;

        nightMode.addEventListener("click", function () {
                if (document.getElementById('hide-checkbox').checked === true) {
                    localStorage.theme = 'light';
                    document.documentElement.classList.remove('dark');
                    document.getElementById("body").classList.add('whiteScrollbar');
                } else {
                    localStorage.theme = 'dark';
                    document.documentElement.classList.add('dark');
                    document.getElementById("body").classList.remove('whiteScrollbar');
                }
        });

        // Chargement de la vue courante
        // Est-ce que le champ "theme" est toujours là ?
        loadHTML("./js/views/" + currentView + ".html");

        //Récupération des différents éléments utilisés
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
        let annulerEvent = document.getElementById("cancelAdd");
        let annulerDisplayEvent = document.getElementById("annulerDisplayEvent");
        let modalDisplayEvent = document.getElementById("modalDisplayEvent");

        let importanceCreate = document.getElementById("importanceCreate");
        let listeImportanceCreate = document.getElementById("listeImportanceCreate");
        importanceCreate.addEventListener('click', function () {
            listeImportanceCreate.classList.contains("hidden") ? listeImportanceCreate.classList.remove("hidden") : listeImportanceCreate.classList.add("hidden");
        });

        let importanceCreate1 = document.getElementById("importanceCreate-1");
        let importanceCreate2 = document.getElementById("importanceCreate-2");
        let importanceCreate3 = document.getElementById("importanceCreate-3");
        let importanceCreateSelected = document.getElementById("importanceCreateSelected");

        importanceCreate1.addEventListener('click', function () {
            importanceCreateSelected.innerHTML =
                "<img src=\"https://img.icons8.com/emoji/48/null/blue-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
                "<span id=\"importanceSelectCreate\" class=\"font-normal ml-3 block truncate w-56\">Normale</span>";
            listeImportanceCreate.classList.add("hidden");
        });

        importanceCreate2.addEventListener('click', function () {
            importanceCreateSelected.innerHTML =
                "<img src=\"https://img.icons8.com/emoji/48/null/purple-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
                "<span id=\"importanceSelectCreate\" class=\"font-normal ml-3 block truncate w-56\">Important</span>";
            listeImportanceCreate.classList.add("hidden");
        });

        importanceCreate3.addEventListener('click', function () {
            importanceCreateSelected.innerHTML =
                "<img src=\"https://img.icons8.com/emoji/48/null/red-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
                "<span id=\"importanceSelectCreate\" class=\"font-normal ml-3 block truncate w-56\">Très important</span>";
            listeImportanceCreate.classList.add("hidden");
        });

        //Setup de la date courante
        toDayWeek();

        //Bouton pour annuler l'ajout d'un évènement
        annulerEvent.addEventListener("click", function () {
            modalNewEvent.classList.add("hidden");
        });

        //Bouton pour annuler l'affichage d'un évènement
        annulerDisplayEvent.addEventListener("click", function () {
            modalDisplayEvent.classList.add("hidden");
        });

        //Bouton pour ajouter un évènement
        addEventButton.addEventListener("click", function () {
            modalNewEvent.classList.remove("hidden");
        });

        //Bouton pour aller au jour/semaine/mois prochain(e)
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

        //Bouton pour aller au jour/semaine/mois précédent(e)
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

        //Bouton pour aller au jour/semaine/mois courant(e)
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

        //Bouton pour afficher le mois
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

        //Bouton pour afficher la semaine
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

        //Bouton pour afficher le jour
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

        //Bouton pour afficher le menu de selection
        menuButton.addEventListener("click", function () {
            selectView.classList.contains("hidden") ? selectView.classList.remove("hidden") : selectView.classList.add("hidden");
        });

        async function subscribe() {
            switch (currentView) {
                case "week":
                    await fillWeek(currentMonth === 1 ? 12 : currentMonth - 1, currentYear, firstDayWeek);
                    break;
                case "month":
                    await fillDays(currentMonth === 1 ? 12 : currentMonth - 1, currentYear);
                    break;
                case "day":
                    await fillDay(currentMonth === 1 ? 11 : currentMonth - 1, currentYear, currentDay);
                    break;
            }
            await new Promise(r => setTimeout(r, 5000));
            await subscribe();
        }

        subscribe().then();
    } else {
        window.location = "/auth"
    }

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

//Fonction pour aller à la semaine suivante
function nextWeek() {
    firstDayWeek.setDate(firstDayWeek.getDate() + 7);
    lastDayWeek.setDate(lastDayWeek.getDate() + 7);
    changeTitleHead();
}

//Fonction pour aller à la semaine précédente
function prevWeek() {
    firstDayWeek.setDate(firstDayWeek.getDate() - 7);
    lastDayWeek.setDate(lastDayWeek.getDate() - 7);
    changeTitleHead();
}

//Fonction pour aller au mois suivant
function nextMonth() {
    if (currentMonth === 12) {
        currentMonth = 1;
        currentYear++;
    } else {
        currentMonth++;
    }
    changeTitleHead();
}

//Fonction pour aller au mois précédent
function prevMonth() {
    if (currentMonth === 1) {
        currentMonth = 12;
        currentYear--;
    } else {
        currentMonth--;
    }
    changeTitleHead();
}

//Fonction pour aller au jour suivant
function nextDay() {
    let date = new Date(currentYear, currentMonth - 1, currentDay);
    date.setDate(date.getDate() + 1);
    currentDay = date.getDate();
    currentMonth = date.getMonth() + 1;
    currentYear = date.getFullYear();
    changeTitleHead();
}

//Fonction pour aller au jour précédent
function prevDay() {
    let date = new Date(currentYear, currentMonth - 1, currentDay);
    date.setDate(date.getDate() - 1);
    currentDay = date.getDate();
    currentMonth = date.getMonth() + 1;
    currentYear = date.getFullYear();
    changeTitleHead();
}

//Fonction pour aller à la semaine courante
function toDayWeek() {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    firstDayWeek = new Date(date.setDate(diff));
    lastDayWeek = new Date()
    lastDayWeek.setDate(firstDayWeek.getDate() + 6);
    changeTitleHead();
}

//Fonction pour aller au mois courant
function toDayMonth() {
    currentMonth = new Date().getMonth() + 1;
    currentYear = new Date().getFullYear();
    changeTitleHead();
}

//Fonction pour aller au jour courant
function toDayDay() {
    let date = new Date();
    currentDay = date.getDate();
    currentMonth = date.getMonth() + 1;
    currentYear = date.getFullYear();
    changeTitleHead();
}

//Fonction pour changer le titre de la page
function changeTitleHead() {
    let mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    switch (currentView) {
        case "month":
            document.getElementById("titleHead").innerHTML = mois[currentMonth - 1] + " " + currentYear
            break;
        case "week":
            document.getElementById("titleHead").innerHTML = "Lun " + firstDayWeek.getUTCDate() + " - " + "Dim " + lastDayWeek.getUTCDate();
            break;
        case "day":
            let jour = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
            document.getElementById("titleHead").innerHTML = jour[new Date(currentYear, currentMonth - 1, currentDay).getDay()] + " " + currentDay + " " + mois[currentMonth - 1] + " " + currentYear;
            break;
    }
}

// Fonction pour afficher un évènement
async function displayEvent(id) {
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
    let importanceDisplay = document.getElementById("importanceDisplay");
    let listeImportanceDisplay = document.getElementById("listeImportanceDisplay");

    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.remove("hidden");

    importanceDisplay.addEventListener('click', function () {
        listeImportanceDisplay.classList.contains("hidden") ? listeImportanceDisplay.classList.remove("hidden") : listeImportanceDisplay.classList.add("hidden");
    });

    let importanceDisplay1 = document.getElementById("importanceDisplay-1");
    let importanceDisplay2 = document.getElementById("importanceDisplay-2");
    let importanceDisplay3 = document.getElementById("importanceDisplay-3");
    let importanceDisplaySelected = document.getElementById("importanceDisplaySelected");

    importanceDisplay1.addEventListener('click', function () {
        importanceDisplaySelected.innerHTML =
            "<img src=\"https://img.icons8.com/emoji/48/null/blue-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
            "<span id=\"importanceSelectDisplay\" class=\"font-normal ml-3 block truncate w-56\">Normale</span>";
        listeImportanceDisplay.classList.add("hidden");
    });

    importanceDisplay2.addEventListener('click', function () {
        importanceDisplaySelected.innerHTML =
            "<img src=\"https://img.icons8.com/emoji/48/null/purple-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
            "<span id=\"importanceSelectDisplay\" class=\"font-normal ml-3 block truncate w-56\">Important</span>";
        listeImportanceDisplay.classList.add("hidden");
    });

    importanceDisplay3.addEventListener('click', function () {
        importanceDisplaySelected.innerHTML =
            "<img src=\"https://img.icons8.com/emoji/48/null/red-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
            "<span id=\"importanceSelectDisplay\" class=\"font-normal ml-3 block truncate w-56\">Très important</span>";
        listeImportanceDisplay.classList.add("hidden");
    });

    title.value = infos.title;
    description.value = infos.description;
    switch (infos.importance) {
        case 'Normale':
            importanceDisplaySelected.innerHTML =
                "<img src=\"https://img.icons8.com/emoji/48/null/blue-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
                "<span id=\"importanceSelectCreate\" class=\"font-normal ml-3 block truncate w-56\">Normale</span>";
            break;
        case 'Important':
            importanceDisplaySelected.innerHTML =
                "<img src=\"https://img.icons8.com/emoji/48/null/purple-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
                "<span id=\"importanceSelectCreate\" class=\"font-normal ml-3 block truncate w-56\">Important</span>";
            break;
        case 'Très important':
            importanceDisplaySelected.innerHTML =
                "<img src=\"https://img.icons8.com/emoji/48/null/red-circle-emoji.png\" alt=\"\" class=\"h-6 w-6 flex-shrink-0 rounded-full\">" +
                "<span id=\"importanceSelectCreate\" class=\"font-normal ml-3 block truncate w-56\">Très important</span>";
            break;
    }

    Number.prototype.AddZero = function (b, c) {
        let l = (String(b || 10).length - String(this).length) + 1;
        return l > 0 ? new Array(l).join(c || '0') + this : this;
    }

    let d = new Date(infos.date);
    date.value = [d.getFullYear(), (d.getMonth() + 1).AddZero(), d.getDate().AddZero()].join('-') + 'T' + [d.getHours().AddZero(), d.getMinutes().AddZero()].join(':');
    duration.value = infos.duration;
}

//Fonction pour récupérer un évènement
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

// Fonction pour modifier un évènement
function modifyEvent(id) {
    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.add("hidden");
    let data = {
        title: document.getElementById("titleDisplayEvent").value,
        description: document.getElementById("descriptionDisplayEvent").value,
        date: document.getElementById("dateDisplayEvent").value,
        duration: document.getElementById("durationDisplayEvent").value,
        importance: document.getElementById("importanceSelectDisplay").innerText
    }
    fetch("/modifyEvent/" + id,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        }).then(r => r.json());
    loadHTML("./js/views/" + currentView + ".html");
}

// Fonction pour supprimer un évènement
function deleteEvent(id) {
    let displayEvent = document.getElementById("modalDisplayEvent");
    displayEvent.classList.add("hidden");
    fetch("/deleteEvent/" + id,
        {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        }).then(r => r.json());
    loadHTML("./js/views/" + currentView + ".html");
}