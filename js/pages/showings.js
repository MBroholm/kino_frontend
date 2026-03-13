import {getMovies} from "../services/moviesService.js";
import {getTheatres} from "../services/theatresService.js";
import {getShowings, createShowing, deleteShowing} from "../services/showingsService.js";
import {redirectIfNotLoggedIn} from "../auth.js";

redirectIfNotLoggedIn();

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
        const message = document.getElementById("message");
        message.textContent = "Showing created!";
        message.style.color = "green";
        await loadShowings();
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
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

            // 2. Group by theatre
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

    const headers = ["Movie", "Start Time", "End Time", "Price", "Action"];
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
        row.appendChild(movieCell);

        const startTimeCell = document.createElement("td");
        startTimeCell.textContent = formatTime(showing.startTime);
        row.appendChild(startTimeCell);

        const endTimeCell = document.createElement("td");
        endTimeCell.textContent = formatTime(showing.endTime);
        row.appendChild(endTimeCell)

        const priceCell = document.createElement("td");
        priceCell.textContent = `${showing.price} kr`;
        row.appendChild(priceCell);

        const actionCell = document.createElement("td");
        row.appendChild(actionCell);

        const editLink = document.createElement("a");
        editLink.textContent = "Edit";
        editLink.href = `edit-showing.html?id=${showing.showingId}`;
        actionCell.appendChild(editLink);

        const bookingLink = document.createElement("a");
        bookingLink.textContent = "Booking";
        bookingLink.href = `../booking.html?showingId=${showing.showingId}`;
        bookingLink.style.marginLeft = "12px";
        actionCell.appendChild(bookingLink);

        const deleteLink = document.createElement("a");
        deleteLink.textContent = "Delete";
        deleteLink.href = "#";
        deleteLink.style.marginLeft = "12px";
        deleteLink.addEventListener("click", (e) => {
            e.preventDefault();
            handleDelete(showing.showingId);
        });
        actionCell.appendChild(deleteLink);
    });

    return wrapper;
}

async function handleDelete(showingId) {
    const confirmed = confirm("Are you sure you want to delete this showing?");

    if (!confirmed) {
        return; // user cancelled
    }

    try {
        await deleteShowing(showingId);
        window.location.href = "showings.html";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
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