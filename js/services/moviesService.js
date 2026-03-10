import { fetchJson } from "../api.js";

export function getMovies() {
    return fetchJson("/api/movies");
}