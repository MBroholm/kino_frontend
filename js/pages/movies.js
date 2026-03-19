import {getCategories} from "../services/metadataService.js";
import {getMovies, createMovie, deleteMovie, getShowingsForMovie} from "../services/moviesService.js";

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

    const movieForm = document.getElementById("movieForm");
    movieForm.addEventListener("submit", (e) => handleSubmit(e, container, params));

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

async function handleSubmit(event, container, params) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const ageLimit = parseInt(document.getElementById("ageLimit").value, 10);
    const duration = parseInt(document.getElementById("duration").value, 10);
    const categories = Array.from(document.querySelectorAll("#categoriesContainer input:checked")).map(cb => cb.value);
    const description = document.getElementById("description").value;

    try {
        await createMovie({title, ageLimit, duration, categories, description});
        document.getElementById("message").textContent = "Movie created!";
        document.getElementById("message").style.color = "green";
        await loadMovies(container);
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
        document.getElementById("message").style.color = "red";
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

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = thead.insertRow();
    ["Title", "Age Limit", "Duration", "Categories", "Description", "Action"].forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        headerRow.appendChild(th);
    });
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    movies.forEach(movie => {
        const row = tbody.insertRow();
        row.insertCell().textContent = movie.title;
        row.insertCell().textContent = movie.ageLimit;
        row.insertCell().textContent = movie.duration + " min";
        row.insertCell().textContent = movie.categories.join(", ");
        row.insertCell().textContent = movie.description;

        const actionCell = row.insertCell();
        const editLink = document.createElement("a");
        editLink.textContent = "Edit";
        editLink.href = `#/admin/edit-movie?id=${movie.movieId}`;
        actionCell.appendChild(editLink);

        const deleteLink = document.createElement("a");
        deleteLink.textContent = "Delete";
        deleteLink.href = "#";
        deleteLink.style.marginLeft = "12px";
        deleteLink.addEventListener("click", async (e) => {
            e.preventDefault();
            const showings = await getShowingsForMovie(movie.movieId);
            if (showings.length > 0) {
                alert("Can't delete movie, because it is included in an existing showing");
                return;
            }
            if (confirm("Are you sure you want to delete this movie?")) {
                try {
                    await deleteMovie(movie.movieId);
                    await loadMovies(container);
                } catch (err) {
                    document.getElementById("message").textContent = "Error: " + err.message;
                }
            }
        });
        actionCell.appendChild(deleteLink);
    });
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

export default { render };
