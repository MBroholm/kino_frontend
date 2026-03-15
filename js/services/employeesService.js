import {fetchJsonAdmin, postJsonAdmin, putJsonAdmin, requestDeleteAdmin } from "../api.js";

export function getEmployees(){ return fetchJsonAdmin("/api/admin/employees"); }

export function getEmployee(id) { return fetchJsonAdmin(`/api/admin/employees/${id}`); }

export function createEmployee(employee) { return postJsonAdmin("/api/admin/employees", employee); }

export function updateEmployee(employee) { return putJsonAdmin(`/api/admin/employees/${employee.id}`, employee); }

export function deleteEmployee(id) { return requestDeleteAdmin(`/api/admin/employees/${id}`); }