import {login} from "../auth.js";

async function render(container, params) {
    if (localStorage.getItem("token")) {
        window.location.hash = "#/admin/dashboard";
        return;
    }

    container.innerHTML = `
        <form id="loginForm">
            <h1>Admin Login</h1>
            <input id="username" type="text" placeholder="Username" required>
            <input id="password" type="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <div id="message"></div>
    `;

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            await login(username, password);
            window.location.hash = "#/admin/dashboard";
        } catch (err) {
            document.getElementById("message").textContent = "Invalid login";
        }
    });
}

export default { render };
