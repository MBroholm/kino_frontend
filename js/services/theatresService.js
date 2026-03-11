import { fetchJsonAdmin, postJsonAdmin, putJsonAdmin, requestDeleteAdmin } from "../api.js";

export function getTheatres() { return fetchJsonAdmin("/api/admin/theatres"); }

export function createTheatre(theatre) { return postJsonAdmin("/api/admin/theatres", theatre); }

export function updateTheatre(id, theatre) { return putJsonAdmin(`/api/admin/theatres/${id}`, theatre); }

export function deleteTheatre(theatreId) { return requestDeleteAdmin(`/api/admin/theatres/${theatreId}`); }