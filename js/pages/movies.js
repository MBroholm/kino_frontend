import {redirectIfNotLoggedIn} from "../auth.js";
import {getCategories} from "../services/metadataService.js";
import {createMovie} from "../services/moviesService.js";

redirectIfNotLoggedIn()

document.addEventListener("DOMContentLoaded", async () => {
    await loadCategories();
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
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
    }
}