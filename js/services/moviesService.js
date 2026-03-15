import {fetchJson, postJsonAdmin, putJsonAdmin, requestDeleteAdmin} from "../api.js";

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

export function deleteMovie(id) {
    return requestDeleteAdmin(`/api/admin/movies/${id}`);
}

export function updateMovie(id, data) {
    return putJsonAdmin(`/api/admin/movies/${id}`, data);
}