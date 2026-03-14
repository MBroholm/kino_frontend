import {fetchJson} from "../api";

export function getCategories() {
    return fetchJson("/api/categories");
}

export function getEmployeeRoles() {
    return fetchJson("/api/employee-roles");
}

export function getReservationStatuses() {
    return fetchJson("/api/reservation-statuses")
}