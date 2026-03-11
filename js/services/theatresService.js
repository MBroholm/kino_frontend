import { fetchJsonAdmin } from "../api.js";

export function getTheatres() {
    return fetchJsonAdmin("/api/admin/theatres");
}