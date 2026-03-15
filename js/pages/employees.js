import {createEmployee, deleteEmployee, getEmployees} from '../services/employeesService.js';
import {redirectIfNotLoggedIn, getCurrentUsername} from "../auth.js";

redirectIfNotLoggedIn();

document.addEventListener("DOMContentLoaded", async () => {
    await loadEmployees()
    document.getElementById("employeeForm").addEventListener("submit", handleSubmit);
});

async function loadEmployees() {
    const employees = await getEmployees();
    const container = document.getElementById("employeesContainer");
    container.innerHTML = "";
    employees.forEach(employee=> {
        const employeeDiv = document.createElement("div")
        employeeDiv.classList.add("employee");
        employeeDiv.innerHTML = `
        <h3> Employee ${employee.username}</h3>
`
        if (getCurrentUsername() !== employee.username) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => handleDelete(employee.employeeId));
            employeeDiv.appendChild(deleteBtn);
    }
        container.appendChild(employeeDiv)})
}

async function handleDelete(employeeId) {
    const confirmed = confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;
    try {
        await deleteEmployee(employeeId);
        window.location.href = "employees.html";
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
    }
}

async function handleEdit(employeeId) {
    window.location.href = `edit-employee.html?id=${employeeId}`
}

async function handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) { return alert("Passwords do not match"); }

    try {
        await createEmployee({ username, password, roles: [role] });
        window.location.href = "employees.html";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}