// Router for Kino SPA
import { isLoggedIn, logout, getCurrentUsername } from "./auth.js";

const routes = {
    "/": { module: "./pages/index.js", auth: false },
    "/movie": { module: "./pages/movie.js", auth: false },
    "/booking": { module: "./pages/booking.js", auth: false },
    "/admin": { module: "./pages/login.js", auth: false }, // Login page
    "/admin/dashboard": { module: "./pages/dashboard.js", auth: true },
    "/admin/movies": { module: "./pages/movies.js", auth: true },
    "/admin/edit-movie": { module: "./pages/edit-movie.js", auth: true },
    "/admin/showings": { module: "./pages/showings.js", auth: true },
    "/admin/edit-showing": { module: "./pages/edit-showing.js", auth: true },
    "/admin/theatres": { module: "./pages/theatres.js", auth: true },
    "/admin/edit-theatre": { module: "./pages/edit-theatre.js", auth: true },
    "/admin/reservations": { module: "./pages/reservations.js", auth: true },
    "/admin/employees": { module: "./pages/employees.js", auth: true },
    "/admin/edit-employee": { module: "./pages/edit-employee.js", auth: true },
    // Add more admin routes here
};

async function handleRoute() {
    const hash = window.location.hash || "#/";
    const [path, queryString] = hash.slice(1).split("?");
    const params = new URLSearchParams(queryString || "");
    
    const route = routes[path] || routes["/"];

    if (route.auth && !isLoggedIn()) {
        window.location.hash = "#/admin";
        return;
    }

    updateNav();

    try {
        const { default: page } = await import(route.module);
        const content = document.getElementById("content");
        content.innerHTML = ""; // Clear current content
        await page.render(content, params);
    } catch (err) {
        console.error("Failed to load page:", err);
        document.getElementById("content").innerHTML = "<h2>Page not found or error loading</h2>";
    }
}

function updateNav() {
    const authStatus = document.getElementById("auth-status");
    if (isLoggedIn()) {
        const username = getCurrentUsername();
        authStatus.innerHTML = `
            <span>Logged in as ${username}</span>
            <button id="logout-btn">Logout</button>
        `;
        document.getElementById("logout-btn").addEventListener("click", () => {
            logout();
            window.location.hash = "#/";
        });
    } else {
        authStatus.innerHTML = "";
    }
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

export function navigate(path) {
    window.location.hash = path;
}
