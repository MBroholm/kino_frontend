// Extract movieId from URL: movie.html?id=3
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

import {getMovieById, getShowingsForMovie} from "../services/moviesService.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadMovie();
    await loadShowings();
});

async function loadMovie() {
    if (!movieId) {
        document.getElementById("title").textContent = "No movie ID provided";
        return;
    }

    const movie = await getMovieById(movieId);

    document.getElementById("title").textContent = movie.title;
    document.getElementById("ageLimit").textContent = `Age limit: ${movie.ageLimit}+`;
    document.getElementById("duration").textContent = `Duration: ${movie.duration} min`;
    document.getElementById("description").textContent = movie.description;

    const categoriesDiv = document.getElementById("categories");
    categoriesDiv.innerHTML = "";

    movie.categories.forEach(cat => {
        const tag = document.createElement("span");
        tag.className = "category-tag";
        tag.textContent = cat;
        categoriesDiv.appendChild(tag);
    });
}

async function loadShowings() {
    const container = document.getElementById("showing-container");
    container.innerHTML = "";

    const showings = await getShowingsForMovie(movieId);

    if (!showings || showings.length === 0) {
        container.textContent = "No showings available";
        return;
    }

    // Group by date
    const grouped = groupBy(showings, showing => extractDate(showing.startTime));

    Object.keys(grouped)
        .sort()
        .forEach(date => {
            const dateDiv = document.createElement("div");
            dateDiv.className = "showing-date";

            const dateHeader = document.createElement("h3");
            dateHeader.textContent = formatDate(date);
            dateDiv.appendChild(dateHeader);

            const list = document.createElement("div");
            list.className = "showing-list";

            grouped[date]
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                .forEach(showing => {
                    const item = document.createElement("div");
                    item.className = "showing-item";
                    item.addEventListener("click", () => {
                        window.location.href = `booking.html?showingId=${showing.showingId}`;
                    });

                    const timeElement = document.createElement("span");
                    timeElement.className = "showing-time";
                    timeElement.textContent = formatTime(showing.startTime);

                    const theatreElement = document.createElement("span");
                    theatreElement.className = "showing-theatre";
                    theatreElement.textContent = `Theatre ${showing.theatreNumber}`

                    item.appendChild(timeElement);
                    item.appendChild(theatreElement)

                    list.appendChild(item);
                });

            dateDiv.appendChild(list);
            container.appendChild(dateDiv);
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