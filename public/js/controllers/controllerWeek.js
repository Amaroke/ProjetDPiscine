async function fillWeek(firstDayWeek,twoDayWeek, threeDayWeek, fourDayWeek, fiveDayWeek, sixDayWeek ,lastDayWeek, month, year, day){

    let actualDate = new Date(year, month, day)
    let lesJoursDeLaSemaine = [firstDayWeek, twoDayWeek, threeDayWeek, fourDayWeek, fiveDayWeek, sixDayWeek, lastDayWeek];
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


    for(const [index, jour] of lesJoursDeLaSemaine.entries()){
        for (const test of events) {
            console.log(new Date(test.date).getDate() === (jour.getDate()), index)
            if (new Date(test.date).getDate() === (jour.getDate())) {
                document.getElementById("lesEvenements").innerHTML +=
                    "<li class=\"relative mt-px flex sm:col-start-"+ (index +1) +"\" style=\"grid-row: "+ (2+12*new Date(test.date).getHours()) +" / span "+ 0.2* test.duration +"\">" +
                    "<a href=\"#\"\n" +
                    "class=\"group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200\">\n" +
                    "<p class=\"order-1 font-semibold text-gray-700\">" + test.title + "</p>\n" +
                    "<p class=\"text-gray-500 group-hover:text-gray-700\">\n" +
                    "<time datetime=\" " + new Date(test.date).getHours() + "\">" + new Date(test.date).getHours() +" : " + new Date(test.date).getMinutes() +"</time>\n" +
                    "</p>\n" +
                    "</a>" +
                    "</li>"
                ;


            }


        }
    }


    //IMMONDICE
    document.getElementById("day1").innerHTML = firstDayWeek.getUTCDate();
    document.getElementById("day2").innerHTML = twoDayWeek.getUTCDate();
    document.getElementById("day3").innerHTML = threeDayWeek.getUTCDate();
    document.getElementById("day4").innerHTML = fourDayWeek.getUTCDate();
    document.getElementById("day5").innerHTML = fiveDayWeek.getUTCDate();
    document.getElementById("day6").innerHTML = sixDayWeek.getUTCDate();
    document.getElementById("day7").innerHTML = lastDayWeek.getUTCDate();



}