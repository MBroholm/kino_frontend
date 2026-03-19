import {getCategories} from "../services/metadataService.js";
import {getMovieById, updateMovie} from "../services/moviesService.js";

async function render(container, params) {
    const movieId = params.get("id");
    const movie = await getMovieById(movieId);

    if (!movie) {
        container.innerHTML = "<h2>Movie not found</h2>";
        return;
    }

    container.innerHTML = `
        <a href="#/admin/movies">← Back to Movies</a>
        <h2>Edit Movie</h2>
        <form id="editMovieForm">
            <label for="title">Title:</label>
            <input type="text" id="title" value="${movie.title}" required>
            <label for="ageLimit">Age limit:</label>
            <input type="number" id="ageLimit" value="${movie.ageLimit}" min="0" step="1" required>
            <label for="duration">Duration:</label>
            <input type="number" id="duration" value="${movie.duration}" min="0" step="1" required>
            <label>Categories:</label>
            <div id="categoriesContainer"></div>
            <label for="description">Description:</label>
            <textarea id="description" rows="4" required>${movie.description}</textarea>
            <button type="submit">Save Movie</button>
        </form>
        <div id="message"></div>
    `;

    await loadCategories(movie.categories);

    document.getElementById("editMovieForm").addEventListener("submit", (e) => handleSubmit(e, movieId));
}

async function loadCategories(selectedCategories) {
    const categories = await getCategories();
    const container = document.getElementById("categoriesContainer");
    categories.forEach(category => {
        const label = document.createElement("label");
        label.style.display = "block";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;
        if (selectedCategories.includes(category)) checkbox.checked = true;
        label.appendChild(checkbox);
        label.append(" " + category);
        container.appendChild(label);
    });
}

async function handleSubmit(event, movieId) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const ageLimit = parseInt(document.getElementById("ageLimit").value, 10);
    const duration = parseInt(document.getElementById("duration").value, 10);
    const categories = Array.from(document.querySelectorAll("#categoriesContainer input:checked")).map(cb => cb.value);
    const description = document.getElementById("description").value;

    try {
        await updateMovie(movieId, {title, ageLimit, duration, categories, description});
        window.location.hash = "#/admin/movies";
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
    }
}

export default { render };
