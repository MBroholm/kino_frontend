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
    const data = await postJson(`/api/auth/login`, { username, password });
    localStorage.setItem("token", data.token);
}

export function logout() {
    localStorage.removeItem("token");
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
