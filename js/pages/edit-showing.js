import {getShowingById, updateShowing, deleteShowing} from "../services/showingsService.js";
import {getMovies} from "../services/moviesService.js";
import {getTheatres} from "../services/theatresService.js";

async function render(container, params) {
    const showingId = params.get("id");
    const showing = await getShowingById(showingId);

    if (!showing) {
        container.innerHTML = "<h2>Showing not found</h2>";
        return;
    }

    container.innerHTML = `
        <a href="#/admin/showings">← Back to Showings</a>
        <h2>Edit Showing</h2>
        <form id="editShowingForm">
            <label for="movieSelect">Movie:</label>
            <select id="movieSelect"></select>
            <label for="theatreSelect">Theatre:</label>
            <select id="theatreSelect"></select>
            <label for="startTime">Start Time:</label>
            <input type="datetime-local" id="startTime" value="${showing.startTime.slice(0, 16)}">
            <label for="price">Price:</label>
            <input type="number" id="price" value="${showing.price}" min="0" step="0.01" required>
            <button type="submit">Save Changes</button>
        </form>
        <button id="btnDelete">Delete Showing</button>
        <div id="message"></div>
    `;

    await loadMovies(showing.movieId);
    await loadTheatres(showing.theatreId);

    document.getElementById("editShowingForm").addEventListener("submit", (e) => handleSubmit(e, showingId));
    document.getElementById("btnDelete").addEventListener("click", () => handleDelete(showingId));
}

async function loadMovies(selectedId) {
    const movies = await getMovies();
    const select = document.getElementById("movieSelect");
    movies.forEach(movie => {
        const opt = document.createElement("option");
        opt.value = movie.movieId;
        opt.textContent = movie.title;
        if (movie.movieId === selectedId) opt.selected = true;
        select.appendChild(opt);
    });
}

async function loadTheatres(selectedId) {
    const theatres = await getTheatres();
    const select = document.getElementById("theatreSelect");
    theatres.forEach(theatre => {
        const opt = document.createElement("option");
        opt.value = theatre.theatreId;
        opt.textContent = `Theatre ${theatre.theatreNumber}`;
        if (theatre.theatreId === selectedId) opt.selected = true;
        select.appendChild(opt);
    });
}

async function handleSubmit(event, showingId) {
    event.preventDefault();
    const movieId = document.getElementById("movieSelect").value;
    const theatreId = document.getElementById("theatreSelect").value;
    const startTime = document.getElementById("startTime").value;
    const price = document.getElementById("price").value;

    try {
        await updateShowing(showingId, {movieId, theatreId, startTime, price});
        window.location.hash = "#/admin/showings";
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
    }
}

async function handleDelete(showingId) {
    if (confirm("Are you sure you want to delete this showing?")) {
        try {
            await deleteShowing(showingId);
            window.location.hash = "#/admin/showings";
        } catch (err) {
            const message = document.getElementById("message");
            message.textContent = "Error: " + err.message;
            message.style.color = "red";
        }
    }
}

export default { render };
