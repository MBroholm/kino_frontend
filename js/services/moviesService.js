import {fetchJson, postJsonAdmin} from "../api.js";

export function getMovies() {
    return fetchJson("/api/movies");
}

export function getMovieById(id) {
    return fetchJson(`/api/movies/${id}`);
}

export function getShowingForMovie(id) {
    return fetchJson(`/api/movies/${id}/showings`);
}

export function createMovie(data) {
    return postJsonAdmin("/api/admin/movies", data);
}