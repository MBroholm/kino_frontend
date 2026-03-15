import { postJson } from "../api.js";

export function createReservation(data) {
    return postJson("/api/reservations", data);
}

