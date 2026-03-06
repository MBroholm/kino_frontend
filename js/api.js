const BASE_URL = "http://localhost:8080";

// -------------------------------
// Generic JSON helpers
// -------------------------------

async function fetchJson(url) {
    let response;

    try {
        response = await fetch(url);
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

async function postJson(url, data, method = "POST") {
    const response = await fetch(url, {
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

async function fetchJsonAdmin(url) {
    const token = localStorage.getItem("token");
    let response;

    try {
        response = await fetch(url, {
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

async function postJsonAdmin(url, data, method = "POST") {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
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

async function requestDeleteAdmin(url) {
    const token = localStorage.getItem("token");
    let response;

    try {
        response = await fetch(url, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
    } catch (err) {
        throw new Error(`Network error: ${err.message}`);
    }

    //If token is missing or expired, redirect to login page
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


// -------------------------------
// DELETE helper
// -------------------------------

async function requestDelete(url) {
    let response;

    try {
        response = await fetch(url, { method: "DELETE" });
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
