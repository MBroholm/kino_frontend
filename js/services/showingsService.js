import {fetchJson, postJsonAdmin, putJsonAdmin, requestDeleteAdmin} from "../api.js";

export function getShowings() {
    return fetchJson("/api/showings");
}

export function createShowing(data) {
    return postJsonAdmin("/api/admin/showings", data);
}

export function getShowingById(id) {
    return fetchJson(`/api/showings/${id}`);
}

export function updateShowing(id, data) {
    return putJsonAdmin(`/api/admin/showings/${id}`, data);
}

export function deleteShowing(id) {
    return requestDeleteAdmin(`/api/admin/showings/${id}`);
}