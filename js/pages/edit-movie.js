import {redirectIfNotLoggedIn} from "../auth.js";
import {getCategories} from "../services/metadataService.js";
import {getMovieById, updateMovie} from "../services/moviesService.js";

redirectIfNotLoggedIn();

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

document.addEventListener("DOMContentLoaded", async () => {
    const movie = await getMovieById(movieId);

    if (!movie) {
        alert("Movie not found");
        return;
    }

    document.getElementById("title").value = movie.title;
    document.getElementById("ageLimit").value = movie.ageLimit;
    document.getElementById("duration").value = movie.duration;

    await loadCategories(movie.categories);

    document.getElementById("description").value = movie.description;

    document.getElementById("editMovieForm").addEventListener("submit", handleSubmit);
});

async function loadCategories(selectedCategories) {
    const categories = await getCategories();
    const container = document.getElementById("categoriesContainer");

    categories.forEach(category => {
        const label = document.createElement("label");
        label.style.display = "block";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;
        if (selectedCategories.includes(category)) {
            checkbox.checked = true;
        }

        label.appendChild(checkbox);
        label.append(" " + category);

        container.appendChild(label);
    });
}

async function handleSubmit(event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const ageLimit = parseInt(document.getElementById("ageLimit").value, 10);
    const duration = parseInt(document.getElementById("duration").value, 10);
    const categories = Array.from(
        document.querySelectorAll("#categoriesContainer input:checked")
    ).map(cb => cb.value);
    const description = document.getElementById("description").value;

    try {
        await updateMovie(movieId, {title, ageLimit, duration, categories, description});
        window.location.href = "movies.html";
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
    }
}