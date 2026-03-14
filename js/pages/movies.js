import {redirectIfNotLoggedIn} from "../auth.js";

redirectIfNotLoggedIn()

document.addEventListener("DOMContentLoaded", async () => {
    await loadCategories();
});

async function loadCategories() {

}