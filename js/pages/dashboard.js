import {redirectIfNotLoggedIn, logout} from "../auth.js";

redirectIfNotLoggedIn();

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("btnLogout").addEventListener("click", logout);
});