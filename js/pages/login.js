import {login} from "../auth.js";

// If a token exists, user is already logged in → redirect
if (localStorage.getItem("token")) {
    window.location.href = "/admin/dashboard.html";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        await login(username, password);
    } catch (err) {
        document.getElementById("message").textContent = "Invalid login";
    }
});
