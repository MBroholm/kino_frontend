import {getCategories} from "../services/metadataService.js";
import {getMovies, createMovie, deleteMovie, getShowingsForMovie} from "../services/moviesService.js";
import {renderTable} from "../components/Table.js";

async function render(container, params) {
    container.innerHTML = `
        <a href="#/admin/dashboard">← Back to Dashboard</a>
        <h2>Add New Movie</h2>
        <form id="movieForm">
            <label for="title">Title:</label>
            <input type="text" id="title" required>
            <label for="ageLimit">Age limit:</label>
            <input type="number" id="ageLimit" min="0" step="1" required>
            <label for="duration">Duration:</label>
            <input type="number" id="duration" min="0" step="1" required>
            <label>Categories:</label>
            <div id="categoriesContainer"></div>
            <label for="description">Description:</label>
            <textarea id="description" rows="4" required></textarea>
            <button type="submit">Save Movie</button>
        </form>
        <div id="message"></div>
        <h2>Current movies:</h2>
        <div id="moviesTableContainer"></div>
    `;

    document.getElementById("movieForm").addEventListener("submit", (e) => handleSubmit(e, container));
    await loadCategories();
    await loadMovies(container);
}

async function loadCategories() {
    const categories = await getCategories();
    const container = document.getElementById("categoriesContainer");
    categories.forEach(category => {
        const label = document.createElement("label");
        label.style.display = "block";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;
        label.appendChild(checkbox);
        label.append(" " + category);
        container.appendChild(label);
    });
}

async function handleSubmit(event, container) {
    event.preventDefault();
    const movieData = {
        title: document.getElementById("title").value,
        ageLimit: parseInt(document.getElementById("ageLimit").value, 10),
        duration: parseInt(document.getElementById("duration").value, 10),
        categories: Array.from(document.querySelectorAll("#categoriesContainer input:checked")).map(cb => cb.value),
        description: document.getElementById("description").value
    };

    try {
        await createMovie(movieData);
        document.getElementById("message").textContent = "Movie created!";
        await loadMovies(container);
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}

async function loadMovies(container) {
    const movies = await getMovies();
    const tableContainer = document.getElementById("moviesTableContainer");
    tableContainer.innerHTML = "";

    if (movies.length === 0) {
        tableContainer.textContent = "No movies found.";
        return;
    }

    const headers = ["Title", "Age Limit", "Duration", "Categories", "Action"];
    const rows = movies.map(movie => {
        const actions = document.createElement("div");
        
        const editLink = document.createElement("a");
        editLink.textContent = "Edit";
        editLink.href = `#/admin/edit-movie?id=${movie.movieId}`;
        actions.appendChild(editLink);

        const deleteLink = document.createElement("a");
        deleteLink.textContent = "Delete";
        deleteLink.href = "#";
        deleteLink.style.marginLeft = "12px";
        deleteLink.addEventListener("click", async (e) => {
            e.preventDefault();
            if (confirm("Delete movie?")) {
                await deleteMovie(movie.movieId);
                await loadMovies(container);
            }
        });
        actions.appendChild(deleteLink);

        return [
            movie.title,
            movie.ageLimit,
            movie.duration + " min",
            movie.categories.join(", "),
            actions
        ];
    });

    tableContainer.appendChild(renderTable(headers, rows));
}

export default { render };
