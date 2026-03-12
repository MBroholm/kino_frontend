import { fetchJson } from "../api.js";

export function getSeatsForShowing(showingId) {
    return fetchJson(`/api/showings/${showingId}/seats`);
}

