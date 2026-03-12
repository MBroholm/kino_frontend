import { fetchJson} from "../api.js";

export function getSeatsForShowing(showingId) {
    return fetchJson(`http://localhost:8080/api/showings/${showingId}/seats`);
}

