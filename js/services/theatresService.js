import { fetchJsonAdmin } from "../api.js";

export function getTheatres() {
    return fetchJsonAdmin("http://localhost:8080/api/admin/theatres");
}