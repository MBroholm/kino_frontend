console.log("test")

// Extract movieId from URL: movie.html?id=3
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

import {getMovieById} from "../services/moviesService.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadMovie();
    console.log("test")
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

