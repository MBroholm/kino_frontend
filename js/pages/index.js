import {getMovies} from "../services/moviesService.js";

async function render(container, params) {
    container.innerHTML = `
        <h2>Now Showing</h2>
        <div id="moviesContainer"></div>
    `;

    const movies = await getMovies();
    const moviesContainer = document.getElementById("moviesContainer");
    
    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        moviesContainer.appendChild(movieDiv);
        movieDiv.classList.add("movie-card");
        movieDiv.addEventListener("click", () => {
            window.location.hash = `#/movie?id=${movie.movieId}`;
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

export default { render };
