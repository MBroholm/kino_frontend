import {getEmployee, updateEmployee} from "../services/employeesService.js";

async function render(container, params) {
    const employeeId = params.get("id");
    const employee = await getEmployee(employeeId);

    if (!employee) {
        container.innerHTML = "<h2>Employee not found</h2>";
        return;
    }

    container.innerHTML = `
        <a href="#/admin/employees">← Back to Employees</a>
        <h2>Edit Employee</h2>
        <form id="editEmployeeForm">
            <label for="username">Username:</label>
            <input type="text" id="username" value="${employee.username}" required>
            <label for="password">New Password (leave blank to keep current):</label>
            <input type="password" id="password">
            <label for="role">Role:</label>
            <select id="role">
                <option value="ADMIN" ${employee.roles.includes("ADMIN") ? "selected" : ""}>Admin</option>
                <option value="TICKET_INSPECTOR" ${employee.roles.includes("TICKET_INSPECTOR") ? "selected" : ""}>Ticket Inspector</option>
                <option value="TICKET_STAFF" ${employee.roles.includes("TICKET_STAFF") ? "selected" : ""}>Ticket Staff</option>
                <option value="MOVIE_OPERATOR" ${employee.roles.includes("MOVIE_OPERATOR") ? "selected" : ""}>Movie Operator</option>
            </select>
            <button type="submit">Save Changes</button>
        </form>
        <div id="message"></div>
    `;

    document.getElementById("editEmployeeForm").addEventListener("submit", (e) => handleSubmit(e, employeeId));
}

async function handleSubmit(event, employeeId) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
        await updateEmployee(employeeId, { username, password, roles: [role] });
        window.location.hash = "#/admin/employees";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}

export default { render };
