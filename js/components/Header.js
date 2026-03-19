import { isLoggedIn, logout, getCurrentUsername } from "../auth.js";

export function renderHeader() {
    const username = getCurrentUsername();
    
    const header = document.createElement("header");
    header.className = "site-header";
    
    header.innerHTML = `
        <div class="header-container">
            <h1 class="logo"><a href="#/">Kino</a></h1>
            <nav class="nav-links">
                <a href="#/">Home</a>
                ${isLoggedIn() ? `
                    <a href="#/admin/dashboard">Admin</a>
                    <a href="#/admin/movies">Movies</a>
                    <a href="#/admin/showings">Showings</a>
                ` : ""}
            </nav>
            <div class="auth-status">
                ${isLoggedIn() 
                    ? `<span>Logged in as ${username}</span> <button id="logout-btn">Logout</button>` 
                    : `<a href="#/admin">Login</a>`}
            </div>
        </div>
    `;

    const logoutBtn = header.querySelector("#logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logout();
            window.location.hash = "#/";
        });
    }

    return header;
}
