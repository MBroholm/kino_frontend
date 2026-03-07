import { fetchJson } from "../api.js";

export function getTheatres() {
    return fetchJson("http://localhost:8080/api/theatres");
}