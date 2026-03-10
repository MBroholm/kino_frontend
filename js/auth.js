import {postJson} from "./api.js";

export async function login(username, password) {
    //Calls postJson function which sends HTTP request to backend
    const data = await postJson(`http://localhost:8080/api/auth/login`, { username, password });
    //the backend returns a JSON object with a token, so the data.token is the token(JWT string)
    //the JWT string is saved in browsers local storage under the key "token"
    //The token stays in browsers local storage until it expires or clears browser cache.
    localStorage.setItem("token", data.token);
    //Redirects to admin dashboard
    window.location.href = "/admin/dashboard.html";
}

export function logout() {
    localStorage.removeItem("token");
    window.location.href = "/admin/login.html";
}

export function isLoggedIn() {
    return localStorage.getItem("token");
}

export function redirectIfNotLoggedIn() {
    if (!isLoggedIn()) {
        // Not logged in → go to login page
        window.location.href = "login.html";
    }
}
