import {fetchJson} from "../api.js";

export function getCategories() {
    return fetchJson("/api/metadata/categories");
}

export function getEmployeeRoles() {
    return fetchJson("/api/metadata/employee-roles");
}

export function getReservationStatuses() {
    return fetchJson("/api/metadata/reservation-statuses")
}