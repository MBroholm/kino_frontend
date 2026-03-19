export function renderMovieCard(movie) {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie-card");
    movieDiv.addEventListener("click", () => {
        window.location.hash = `#/movie?id=${movie.movieId}`;
    });

    movieDiv.innerHTML = `
        <h3>${movie.title}</h3>
        <div class="meta">
            <p>Duration: ${movie.duration} min</p>
            <p>Age limit: ${movie.ageLimit}+</p>
        </div>
        <div class="categories">
            ${movie.categories.map(cat => `<span class="category-tag">${cat}</span>`).join("")}
        </div>
    `;

    return movieDiv;
}
