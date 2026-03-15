import {redirectIfNotLoggedIn} from "../auth.js";
import {getCategories} from "../services/metadataService.js";
import {getMovies, createMovie} from "../services/moviesService.js";

redirectIfNotLoggedIn()

document.addEventListener("DOMContentLoaded", async () => {
    await loadCategories();
    await loadMovies();
    document.getElementById("movieForm").addEventListener("submit", handleSubmit);
});

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

async function handleSubmit(event){
    event.preventDefault();

    const title = document.getElementById("title").value;
    const ageLimit = parseInt(document.getElementById("ageLimit").value, 10);
    const duration = parseInt(document.getElementById("duration").value, 10);
    const categories = Array.from(
        document.querySelectorAll("#categoriesContainer input:checked")
    ).map(cb => cb.value);
    const description = document.getElementById("description").value;

    try {
        await createMovie({title,ageLimit,duration,categories,description});
        const message = document.getElementById("message");
        message.textContent = "Movie created!";
        message.style.color = "green";
        await loadMovies();
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
    }
}

async function loadMovies() {
    const movies = await getMovies();
    const container = document.getElementById("moviesTableContainer");
    container.innerHTML = ""; // clear previous

    if (movies.length === 0) {
        container.textContent = "No movies found.";
        return;
    }

    const table = document.createElement("table");

    const thead = document.createElement("thead");
    const headerRow = thead.insertRow();

    ["Title", "Age Limit", "Duration", "Categories", "Description"].forEach(h => {
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
    });

    table.appendChild(tbody);
    container.appendChild(table);
}