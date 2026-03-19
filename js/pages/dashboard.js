async function render(container, params) {
    container.innerHTML = `
        <h1>DASHBOARD</h1>
        <nav>
            <ul>
                <li><a href="#/admin/showings">Showings</a></li>
                <li><a href="#/admin/movies">Movies</a></li>
                <li><a href="#/admin/theatres">Theatres</a></li>
                <li><a href="#/admin/reservations">Reservations</a></li>
                <li><a href="#/admin/employees">Employees</a></li>
            </ul>
        </nav>
    `;
}

export default { render };
