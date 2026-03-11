const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost ? "http://localhost:8080" : "";

// -------------------------------
// Generic JSON helpers
// -------------------------------

export async function fetchJson(endpoint) {
    let response;

    try {
        response = await fetch(BASE_URL + endpoint);
    } catch (err) {
        throw new Error(`Network error: ${err.message}`);
    }

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    try {
        return await response.json();
    } catch (err) {
        throw new Error(`Invalid JSON: ${err.message}`);
    }
}

export async function postJson(endpoint, data, method = "POST") {
    const response = await fetch(BASE_URL + endpoint, {
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

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

        throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");

    return contentType?.includes("application/json")
        ? response.json()
        : response.text();
}


// -------------------------------
// Admin JSON helpers
// -------------------------------

export async function fetchJsonAdmin(endpoint) {
    const token = localStorage.getItem("token");
    let response;

    try {
        response = await fetch(BASE_URL + endpoint, {
            headers: { "Authorization": `Bearer ${token}` }
        });
    } catch (err) {
        throw new Error(`Network error: ${err.message}`);
    }

    if (!response.ok) {
        if (response.status === 401) window.location.href = "/admin/login.html";
        throw new Error(`HTTP error ${response.status}`);
    }

    try {
        return await response.json();
    } catch (err) {
        throw new Error(`Invalid JSON: ${err.message}`);
    }
}

export async function postJsonAdmin(endpoint, data, method = "POST") {
    const token = localStorage.getItem("token");

    const response = await fetch(BASE_URL + endpoint, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        if (response.status === 401) window.location.href = "/admin/login.html";

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

        throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");

    return contentType?.includes("application/json")
        ? response.json()
        : response.text();
}

export async function putJsonAdmin(endpoint, data) {
    return postJsonAdmin(endpoint, data, "PUT");
}


// -------------------------------
// DELETE helpers
// -------------------------------

export async function requestDeleteAdmin(endpoint) {
    const token = localStorage.getItem("token");
    let response;

    try {
        response = await fetch(BASE_URL + endpoint, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
    } catch (err) {
        throw new Error(`Network error: ${err.message}`);
    }

    if (!response.ok) {
        if (response.status === 401) window.location.href = "/admin/login.html";
        throw new Error(`HTTP error ${response.status}`);
    }

    if (response.status === 204) return null;

    try {
        return await response.json();
    } catch {
        return null;
    }
}


export async function requestDelete(endpoint) {
    let response;

    try {
        response = await fetch(BASE_URL + endpoint, { method: "DELETE" });
    } catch (err) {
        throw new Error(`Network error: ${err.message}`);
    }

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    try {
        return await response.json();
    } catch {
        return null;
    }
}