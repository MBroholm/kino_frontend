import { fetchJsonAdmin } from "../api.js";

export function getMovies() {
    return fetchJsonAdmin("http://localhost:8080/api/movies");
}