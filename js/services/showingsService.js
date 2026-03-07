import { postJsonAdmin } from "../api.js";

export function createShowing(data) {
    return postJsonAdmin("http://localhost:8080/api/showings", data);
}