import {postJson} from "./api.js";

function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch (e) {
        return null;
    }
}

export function getCurrentUsername() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = decodeJwt(token);
    return decoded?.sub;
}

function isTokenExpired(token) {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
}

export async function login(username, password) {
    //Calls postJson function which sends HTTP request to backend
    const data = await postJson(`/api/auth/login`, { username, password });
    //the backend returns a JSON object with a token, so the data.token is the token(JWT string)
    //the JWT string is saved in browsers local storage under the key "token"
    //The token stays in browsers local storage until it expires or clears browser cache.
    localStorage.setItem("token", data.token);
    //Redirects to admin dashboard
    window.location.href = "dashboard.html";
}

export function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

export function isLoggedIn() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        return false;
    }

    return true;
}

export function redirectIfNotLoggedIn() {
    if (!isLoggedIn()) {
        // Not logged in → go to login page
        window.location.href = "login.html";
    }
}
