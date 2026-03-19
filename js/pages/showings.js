import {getMovies} from "../services/moviesService.js";
import {getTheatres} from "../services/theatresService.js";
import {getShowings, createShowing, deleteShowing} from "../services/showingsService.js";
import {getSeatsForShowing} from "../services/seatsService.js";

async function render(container, params) {
    container.innerHTML = `
        <a href="#/admin/dashboard">← Back to Dashboard</a>
        <h2>Schedule a New Showing</h2>
        <form id="showingForm">
            <label for="movieSelect">Movie:</label>
            <select id="movieSelect"></select>
            <label for="theatreSelect">Theatre:</label>
            <select id="theatreSelect"></select>
            <label for="startTime">Start Time:</label>
            <input type="datetime-local" id="startTime">
            <label for="price">Price:</label>
            <input type="number" id="price" min="0" step="0.01" required>
            <button type="submit">Create Showing</button>
        </form>
        <div id="message"></div>
        <h2>Scheduled Showings</h2>
        <div id="showingsContainer"></div>
    `;

    await loadMovies();
    await loadTheatres();
    setupStartTimeLimits();
    document.getElementById("showingForm").addEventListener("submit", handleSubmit);
    await loadShowings();
}

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
    const toLocalInputValue = (date) => date.toISOString().slice(0, 16);
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
    const byDate = groupBy(showings, showing => extractDate(showing.startTime));

    for (const date of Object.keys(byDate).sort()) {
        const dateBlock = document.createElement("div");
        dateBlock.classList.add("date-block");
        const dateTitle = document.createElement("h3");
        dateTitle.textContent = formatDate(date);
        dateBlock.appendChild(dateTitle);

        const byTheatre = groupBy(byDate[date], showing => showing.theatreNumber);
        for (const theatreNumber of Object.keys(byTheatre).sort((a, b) => a - b)) {
            const theatreTable = await buildTheatreTable(theatreNumber, byTheatre[theatreNumber]);
            dateBlock.appendChild(theatreTable);
        }
        container.appendChild(dateBlock);
    }
}

async function buildTheatreTable(theatreNumber, showings) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("theatre-block");
    const theatreTitle = document.createElement("h4");
    theatreTitle.textContent = `Theatre ${theatreNumber}`;
    wrapper.appendChild(theatreTitle);

    const table = document.createElement("table");
    table.classList.add("showings-table");
    wrapper.appendChild(table);

    const thead = document.createElement("thead");
    const headerRow = thead.insertRow();
    ["Movie", "Start Time", "End Time", "Price", "Reserved Seats", "Action"].forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        headerRow.appendChild(th);
    });
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (const showing of showings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))) {
        const row = tbody.insertRow();
        row.insertCell().textContent = showing.movieTitle;
        row.insertCell().textContent = formatTime(showing.startTime);
        row.insertCell().textContent = formatTime(showing.endTime);
        row.insertCell().textContent = `${showing.price} kr`;

        const reservedSeatsCell = row.insertCell();
        const showingSeats = await getSeatsForShowing(showing.showingId);
        reservedSeatsCell.textContent = `${showingSeats.filter(s => s.occupied).length} of ${showingSeats.length}`;

        const actionCell = row.insertCell();
        const editLink = document.createElement("a");
        editLink.textContent = "Edit";
        editLink.href = `#/admin/edit-showing?id=${showing.showingId}`;
        actionCell.appendChild(editLink);

        const bookingLink = document.createElement("a");
        bookingLink.textContent = "Booking";
        bookingLink.href = `#/booking?showingId=${showing.showingId}`;
        bookingLink.style.marginLeft = "12px";
        actionCell.appendChild(bookingLink);

        const deleteLink = document.createElement("a");
        deleteLink.textContent = "Delete";
        deleteLink.href = "#";
        deleteLink.style.marginLeft = "12px";
        deleteLink.addEventListener("click", async (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to delete this showing?")) {
                try {
                    await deleteShowing(showing.showingId);
                    await loadShowings();
                } catch (err) {
                    document.getElementById("message").textContent = "Error: " + err.message;
                }
            }
        });
        actionCell.appendChild(deleteLink);
    }
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

function extractDate(dateTimeString) { return dateTimeString.split("T")[0]; }
function formatDate(dateString) { return new Date(dateString).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }); }
function formatTime(dateTimeString) { return new Date(dateTimeString).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }

export default { render };
