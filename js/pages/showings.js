import {getMovies} from "../services/moviesService.js";
import {getTheatres} from "../services/theatresService.js";
import {getShowings, createShowing} from "../services/showingsService.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadMovies();
    await loadTheatres();
    setupStartTimeLimits();

    document.getElementById("showingForm").addEventListener("submit", handleSubmit);

    await loadShowings();
});

async function loadMovies() {
    const movies = await getMovies();
    const select = document.getElementById("movieSelect");

    movies.forEach(movie => {
        const option = document.createElement("option");
        option.value = movie.movieId;
        option.textContent = movie.title;
        select.appendChild(option);
    });
}

async function loadTheatres() {
    const theatres = await getTheatres();
    const select = document.getElementById("theatreSelect");

    theatres.forEach(theatre => {
        const option = document.createElement("option");
        option.value = theatre.theatreId;
        option.textContent = `Theatre ${theatre.theatreNumber}`;
        select.appendChild(option);
    });
}

function setupStartTimeLimits() {
    const input = document.getElementById("startTime");

    const now = new Date();
    const threeMonthsAhead = new Date();
    threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3);

    const toLocalInputValue = (date) =>
        date.toISOString().slice(0, 16);

    input.min = toLocalInputValue(now);
    input.max = toLocalInputValue(threeMonthsAhead);
}

async function handleSubmit(event) {
    event.preventDefault();

    const movieId = document.getElementById("movieSelect").value;
    const theatreId = document.getElementById("theatreSelect").value;
    const startTime = document.getElementById("startTime").value;
    const price = document.getElementById("price").value;

    try {
        await createShowing({movieId, theatreId, startTime, price});
        document.getElementById("message").textContent = "Showing created!";
        await loadShowings();
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}

async function loadShowings() {
    const showings = await getShowings();

    const container = document.getElementById("showingsContainer");
    container.innerHTML = "";

    // 1. Group by date
    const byDate = groupBy(showings, showing => extractDate(showing.startTime));

    Object.keys(byDate)
        .sort()
        .forEach(date => {
            const dateShowings = byDate[date];

            const dateBlock = document.createElement("div");
            dateBlock.classList.add("date-block");

            const dateTitle = document.createElement("h3");
            dateTitle.textContent = formatDate(date);

            dateBlock.appendChild(dateTitle);

            // 2. Group by date
            const byTheatre = groupBy(dateShowings, showing => showing.theatreNumber);

            Object.keys(byTheatre)
                .sort((a, b) => a - b)
                .forEach(theatreNumber => {
                    const theatreShowings = byTheatre[theatreNumber];
                    const theatreTable = buildTheatreTable(theatreNumber, theatreShowings);
                    dateBlock.appendChild(theatreTable)
                })

            container.appendChild(dateBlock);
        })
}

function buildTheatreTable(theatreNumber, showings) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("theatre-block");

    //title
    const theatreTitle = document.createElement("h4");
    theatreTitle.textContent = `Theatre ${theatreNumber}`;
    wrapper.appendChild(theatreTitle);

    //table
    const table = document.createElement("table");
    table.classList.add("showings-table");
    wrapper.appendChild(table);

    //THEAD
    const thead = document.createElement("thead");
    table.appendChild(thead);

    const headerRow = thead.insertRow()

    const headers = ["Movie", "Start Time", "Price"];
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });

    //TBODY
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    showings.forEach(showing => {
        const row = tbody.insertRow();
        const movieCell = document.createElement("td");
        movieCell.textContent = showing.movieTitle;

        const timeCell = document.createElement("td");
        timeCell.textContent = formatTime(showing.startTime);

        const priceCell = document.createElement("td");
        priceCell.textContent = `${showing.price} kr`;

        row.appendChild(movieCell);
        row.appendChild(timeCell);
        row.appendChild(priceCell);
    });

    return wrapper;
}

function groupBy(list, keyGetter) {
    const map = {};
    list.forEach(item => {
        const key = keyGetter(item);
        if (!map[key]) map[key] = [];
        map[key].push(item);
    });
    return map;
}

function extractDate(dateTimeString) {
    return dateTimeString.split("T")[0];
}

function formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

function formatTime(dateTimeString) {
    const d = new Date(dateTimeString);
    return d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}