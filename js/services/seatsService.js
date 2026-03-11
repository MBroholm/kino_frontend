import { fetchJson} from "../api";

export function getSeatsForShowing(showingId) {
    return fetchJson(`http://localhost:8080/api/showings/${showingId}/seats`);
}

