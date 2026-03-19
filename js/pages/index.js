import {getMovies} from "../services/moviesService.js";
import {renderMovieCard} from "../components/MovieCard.js";

async function render(container, params) {
    container.innerHTML = `
        <h2>Now Showing</h2>
        <div id="moviesContainer"></div>
    `;

    const movies = await getMovies();
    const moviesContainer = document.getElementById("moviesContainer");
    
    movies.forEach(movie => {
        moviesContainer.appendChild(renderMovieCard(movie));
    });
}

export default { render };
