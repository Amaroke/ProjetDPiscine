async function fillDay(month, year, day){

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


        for (let test of events) {
            document.getElementById("lesEventsJour").innerHTML +=
                "<li onclick=\"displayEvent(" +test.id +")\" class=\"relative mt-px flex\" style=\"grid-row: "+ parseInt(2+12*new Date(test.date).getHours()+ (12*(new Date(test.date).getMinutes()/60))) +" / span "+ 0.2* test.duration +"\">" +
                "                        <a class=\"cursor-pointer group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100\">\n" +
                "                            <p class=\"order-1 font-semibold text-blue-700\">" +test.title +"</p>\n" +
                "                            <p class=\"text-blue-500 group-hover:text-blue-700\">\n" +
                "                                <time datetime=\" " + new Date(test.date).getHours() + "\">" + new Date(test.date).getHours() +" : " + new Date(test.date).getMinutes() +"</time>\n" +
                "                            </p>\n" +
                "                        </a>\n" +
                "                    </li>";
        }
}