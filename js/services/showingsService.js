import { fetchJson, postJsonAdmin } from "../api.js";

export function getShowings() {
    return fetchJson("http://localhost:8080/api/showings");
}

export function createShowing(data) {
    return postJsonAdmin("http://localhost:8080/api/showings", data);
}