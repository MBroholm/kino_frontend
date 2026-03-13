import {getMovies} from "../services/moviesService.js";

document.addEventListener("DOMContentLoaded", loadMovies);

async function loadMovies() {
    const movies = await getMovies();
    const container = document.getElementById("moviesContainer");
    container.innerHTML = "";
    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        container.appendChild(movieDiv);
        movieDiv.classList.add("movie-card");
        movieDiv.addEventListener("click", () => {
            window.location.href = `movie.html?id=${movie.movieId}`;
        });

        const title = document.createElement("h3");
        title.textContent = `${movie.title}`;
        movieDiv.appendChild(title);

        const metaDiv = document.createElement("div");
        metaDiv.className = "meta";
        movieDiv.appendChild(metaDiv);

        const duration = document.createElement("p");
        duration.textContent = `Duration: ${movie.duration} min`;

        const ageLimit = document.createElement("p");
        ageLimit.textContent = `Age limit: ${movie.ageLimit}+`;

        metaDiv.appendChild(duration);
        metaDiv.appendChild(ageLimit);

        const categoriesDiv = document.createElement("div");

        movie.categories.forEach(cat => {
            const tag = document.createElement("span");
            tag.className = "category-tag";
            tag.textContent = cat;
            categoriesDiv.appendChild(tag);
        });

        movieDiv.appendChild(categoriesDiv);


    });


}
