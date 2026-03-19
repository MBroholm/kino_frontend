import {createEmployee, deleteEmployee, getEmployees} from '../services/employeesService.js';
import {getCurrentUsername} from "../auth.js";

async function render(container, params) {
    container.innerHTML = `
        <a href="#/admin/dashboard">← Back to Dashboard</a>
        <h2>Add New Employee</h2>
        <form id="employeeForm">
            <label for="username">Username:</label>
            <input type="text" id="username" required>
            <label for="password">Password</label>
            <input type="password" id="password" required>
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" required>
            <label for="role">Role:</label>
            <select id="role">
                <option value="ADMIN">Admin</option>
                <option value="TICKET_INSPECTOR">Ticket Inspector</option>
                <option value="TICKET_STAFF">Ticket Staff</option>
                <option value="MOVIE_OPERATOR">Movie Operator</option>
            </select>
            <button type="submit">Add Employee</button>
        </form>
        <div id="message"></div>
        <h2>Current Employees</h2>
        <div id="employeesContainer"></div>
    `;

    document.getElementById("employeeForm").addEventListener("submit", (e) => handleSubmit(e, container));
    await loadEmployees(container);
}

async function loadEmployees(container) {
    const employees = await getEmployees();
    const employeesContainer = document.getElementById("employeesContainer");
    employeesContainer.innerHTML = "";
    
    employees.forEach(employee => {
        const employeeDiv = document.createElement("div");
        employeeDiv.classList.add("employee-card");
        employeeDiv.innerHTML = `<h3>${employee.username}</h3>`;
        
        const actions = document.createElement("div");
        
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => window.location.hash = `#/admin/edit-employee?id=${employee.employeeId}`);
        actions.appendChild(editBtn);

        if (getCurrentUsername() !== employee.username) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.marginLeft = "8px";
            deleteBtn.addEventListener("click", () => handleDelete(employee.employeeId, container));
            actions.appendChild(deleteBtn);
        }

        employeeDiv.appendChild(actions);
        employeesContainer.appendChild(employeeDiv);
    });
}

async function handleDelete(employeeId, container) {
    if (confirm("Are you sure you want to delete this employee?")) {
        try {
            await deleteEmployee(employeeId);
            await loadEmployees(container);
        } catch (err) {
            const message = document.getElementById("message");
            message.textContent = "Error: " + err.message;
            message.style.color = "red";
        }
    }
}

async function handleSubmit(event, container) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        await createEmployee({ username, password, roles: [role] });
        document.getElementById("message").textContent = "Employee created!";
        document.getElementById("message").style.color = "green";
        await loadEmployees(container);
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
        document.getElementById("message").style.color = "red";
    }
}

export default { render };
