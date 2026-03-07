import { getMovies } from "../services/moviesService.js";
import { getTheatres } from "../services/theatresService.js";
import { getShowings, createShowing } from "../services/showingsService.js";

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
        await createShowing({ movieId, theatreId, startTime, price });
        document.getElementById("message").textContent = "Showing created!";
        await loadShowings();
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}

async function loadShowings() {
    const showings = await getShowings();

    // 1. Group by theatre
    const byTheatre = groupBy(showings, s => s.theatreNumber);

    const container = document.getElementById("showingsContainer");
    container.innerHTML = "";

    Object.keys(byTheatre)
        .sort((a, b) => a - b)
        .forEach(theatreNumber => {

            const theatreShowings = byTheatre[theatreNumber];

            // 2. Group by date inside each theatre
            const byDate = groupBy(theatreShowings, s => extractDate(s.startTime));

            const theatreBlock = document.createElement("div");
            theatreBlock.classList.add("theatre-block");

            const theatreTitle = document.createElement("h2");
            theatreTitle.textContent = `Theatre ${theatreNumber}`;
            theatreBlock.appendChild(theatreTitle);

            // 3. Render each date block
            Object.keys(byDate)
                .sort() // dates sort lexicographically correctly
                .forEach(date => {
                    const dateShowings = byDate[date];

                    // Sort by time
                    dateShowings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                    const dateTable = buildDateTable(date, dateShowings);
                    theatreBlock.appendChild(dateTable);
                });

            container.appendChild(theatreBlock);
        });
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

function buildDateTable(date, showings) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("date-block");

    const title = document.createElement("h3");
    title.textContent = formatDate(date);
    wrapper.appendChild(title);

    const table = document.createElement("table");
    table.classList.add("showings-table");

    table.innerHTML = `
        <thead>
            <tr>
                <th>Movie</th>
                <th>Start Time</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            ${showings.map(s => `
                <tr>
                    <td>${s.movieTitle}</td>
                    <td>${formatTime(s.startTime)}</td>
                    <td>${s.price} kr</td>
                </tr>
            `).join("")}
        </tbody>
    `;

    wrapper.appendChild(table);
    return wrapper;
}

function extractDate(dateTimeString) {
    return dateTimeString.split("T")[0];
}

function formatDate(dateString) {
    const d = new Date(dateString);
    return d.toLocaleDateString("da-DK", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

function formatTime(dateTimeString) {
    const d = new Date(dateTimeString);
    return d.toLocaleTimeString("da-DK", {
        hour: "2-digit",
        minute: "2-digit"
    });
}