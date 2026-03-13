import { getMovies } from "../services/moviesService.js";

document.addEventListener("DOMContentLoaded", loadMovies);

async function loadMovies() {
    const movies = await getMovies();
    const container = document.getElementById("moviesContainer");
    container.innerHTML = "";
    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        container.appendChild(movieDiv);
        movieDiv.classList.add("movie-card");
        movieDiv.innerHTML = `
      <h3><a href="movie.html?id=${movie.movieId}">${movie.title}</a></h3>
      <p>Genre: ${movie.categories.join(", ")}</p>
      <p>Age limit: ${movie.ageLimit}+</p>
      <p>Duration: ${movie.duration} min</p>
  `;
    });


}
