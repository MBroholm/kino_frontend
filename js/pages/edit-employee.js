import {getEmployee, updateEmployee} from "../services/employeesService.js";
import {redirectIfNotLoggedIn} from "../auth.js";

redirectIfNotLoggedIn();

const params = new URLSearchParams(window.location.search);
const employeeId = params.get("id");

document.addEventListener("DOMContentLoaded", async () => {
    const employee = await getEmployee(employeeId);

    document.getElementById("username").value = employee.username;

    document.getElementById("editEmployeeForm").addEventListener("submit", handleSubmit);
});

async function handleSubmit(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
        await updateEmployee(employeeId, { username, password, roles: [role] });
        window.location.href = "employees.html";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}