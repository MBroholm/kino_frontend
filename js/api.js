const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost ? "http://localhost:8080" : "";

/**
 * Unified request helper to handle common logic:
 * - Prepending BASE_URL
 * - Adding Auth headers if needed
 * - Handling response parsing (JSON or text)
 * - Handling errors and 401 redirects
 */
async function request(endpoint, options = {}, useAuth = false) {
    const url = BASE_URL + endpoint;

    // Default headers
    const headers = { ...options.headers };

    // Handle Auth header
    if (useAuth) {
        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    // Default to JSON content type if there's a body and no content-type is set
    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const fetchOptions = {
        ...options,
        headers
    };

    let response;
    try {
        response = await fetch(url, fetchOptions);
    } catch (err) {
        throw new Error(`Network error: ${err.message}`);
    }

    // Handle 401 Unauthorized for admin requests
    if (!response.ok && response.status === 401 && useAuth) {
        window.location.hash = "#/admin";
    }

    // Handle common error responses
    if (!response.ok) {
        let errorMessage = `HTTP error ${response.status}`;
        try {
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/json")) {
                const error = await response.json();
                errorMessage = error.message ?? JSON.stringify(error);
            } else {
                errorMessage = await response.text();
            }
        } catch {}
        throw new Error(errorMessage || `HTTP error ${response.status}`);
    }

    // Handle 204 No Content or empty bodies
    if (response.status === 204) return null;

    // Parse response body based on content type
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
        try {
            return await response.json();
        } catch (err) {
            throw new Error(`Invalid JSON: ${err.message}`);
        }
    }

    const text = await response.text();
    return text || null;
}

// -------------------------------
// Public JSON helpers
// -------------------------------

export async function fetchJson(endpoint) {
    return request(endpoint);
}

export async function postJson(endpoint, data, method = "POST") {
    return request(endpoint, {
        method,
        body: JSON.stringify(data)
    });
}

export async function requestDelete(endpoint) {
    return request(endpoint, { method: "DELETE" });
}

// -------------------------------
// Admin JSON helpers
// -------------------------------

export async function fetchJsonAdmin(endpoint) {
    return request(endpoint, {}, true);
}

export async function postJsonAdmin(endpoint, data, method = "POST") {
    return request(endpoint, {
        method,
        body: JSON.stringify(data)
    }, true);
}

export async function putJsonAdmin(endpoint, data) {
    return postJsonAdmin(endpoint, data, "PUT");
}

export async function requestDeleteAdmin(endpoint) {
    return request(endpoint, { method: "DELETE" }, true);
}
