import { getMovies } from "../services/moviesService.js";
import { getTheatres } from "../services/theatresService.js";
import { createShowing } from "../services/showingsService.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadMovies();
    await loadTheatres();

    document.getElementById("showingForm").addEventListener("submit", handleSubmit);
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

async function handleSubmit(event) {
    event.preventDefault();

    const movieId = document.getElementById("movieSelect").value;
    const theatreId = document.getElementById("theatreSelect").value;
    const startTime = document.getElementById("startTime").value;
    const price = document.getElementById("price").value;

    try {
        await createShowing({ movieId, theatreId, startTime, price });
        document.getElementById("message").textContent = "Showing created!";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}