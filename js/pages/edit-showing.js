const params = new URLSearchParams(window.location.search);
const showingId = params.get("id");

console.log("showingId:", showingId);

import {getShowingById, updateShowing, deleteShowing} from "../services/showingsService.js";
import {getMovies} from "../services/moviesService.js";
import {getTheatres} from "../services/theatresService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const showing = await getShowingById(showingId);

    await loadMovies(showing.movieId);
    await loadTheatres(showing.theatreId);

    document.getElementById("startTime").value = showing.startTime.slice(0, 16);
    document.getElementById("price").value = showing.price;

    document.getElementById("editShowingForm").addEventListener("submit", handleSubmit);
    document.getElementById("btnDelete").addEventListener("click", handleDelete);
});

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
    })
}

async function handleSubmit(event) {
    event.preventDefault();

    const movieId = document.getElementById("movieSelect").value;
    const theatreId = document.getElementById("theatreSelect").value;
    const startTime = document.getElementById("startTime").value;
    const price = document.getElementById("price").value;

    try {
        await updateShowing(showingId, {movieId, theatreId, startTime, price});
        window.location.href = "showings.html";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}

async function handleDelete() {
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

