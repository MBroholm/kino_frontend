import {getMovieById, getShowingsForMovie} from "../services/moviesService.js";

async function render(container, params) {
    const movieId = params.get("id");

    container.innerHTML = `
        <a href="#/">← Back to Movies</a>
        <div id="movie-container">
            <h1 id="movie-title">Loading...</h1>
            <div class="meta">
                <span id="ageLimit"></span> |
                <span id="duration"></span>
            </div>
            <div class="categories" id="categories"></div>
            <p id="description"></p>
        </div>
        <h2>Showings:</h2>
        <div id="showing-container"></div>
    `;

    if (!movieId) {
        document.getElementById("movie-title").textContent = "No movie ID provided";
        return;
    }

    try {
        const movie = await getMovieById(movieId);
        document.getElementById("movie-title").textContent = movie.title;
        document.getElementById("ageLimit").textContent = `Age limit: ${movie.ageLimit}+`;
        document.getElementById("duration").textContent = `Duration: ${movie.duration} min`;
        document.getElementById("description").textContent = movie.description;

        const categoriesDiv = document.getElementById("categories");
        movie.categories.forEach(cat => {
            const tag = document.createElement("span");
            tag.className = "category-tag";
            tag.textContent = cat;
            categoriesDiv.appendChild(tag);
        });

        await loadShowings(movieId);
    } catch (err) {
        document.getElementById("movie-title").textContent = "Movie not found";
    }
}

async function loadShowings(movieId) {
    const container = document.getElementById("showing-container");
    const showings = await getShowingsForMovie(movieId);

    if (!showings || showings.length === 0) {
        container.textContent = "No showings available";
        return;
    }

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
                        window.location.hash = `#/booking?showingId=${showing.showingId}`;
                    });

                    const timeElement = document.createElement("span");
                    timeElement.className = "showing-time";
                    timeElement.textContent = formatTime(showing.startTime);

                    const theatreElement = document.createElement("span");
                    theatreElement.className = "showing-theatre";
                    theatreElement.textContent = `Theatre ${showing.theatreNumber}`;

                    item.appendChild(timeElement);
                    item.appendChild(theatreElement);
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

function extractDate(dateTimeString) { return dateTimeString.split("T")[0]; }
function formatDate(dateString) { return new Date(dateString).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }); }
function formatTime(dateTimeString) { return new Date(dateTimeString).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }

export default { render };
