import { fetchJson } from "../api.js";

export function getMovies() {
    return fetchJson("http://localhost:8080/api/movies");
}