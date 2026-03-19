import {getTheatres, createTheatre, deleteTheatre} from "../services/theatresService.js";
import {renderTable} from "../components/Table.js";

async function render(container, params) {
    container.innerHTML = `
        <a href="#/admin/dashboard">← Back to Dashboard</a>
        <h2>Create a new Theatre</h2>
        <form id="theatreForm">
            <label for="theatreNumber">Theatre Number:</label>
            <input type="number" id="theatreNumber" min="1" required>
            <label for="numberOfRows">Number of Rows:</label>
            <input type="number" id="numberOfRows" min="1" required>
            <label for="seatsPerRow">Seats per Rows:</label>
            <input type="number" id="seatsPerRow" min="1" required>
            <button type="submit">Create theatre</button>
        </form>
        <div id="message"></div>
        <h2>Theatres</h2>
        <div id="theatresTableContainer"></div>
    `;

    document.getElementById("theatreForm").addEventListener("submit", (e) => handleSubmit(e, container));
    await loadTheatres(container);
}

async function loadTheatres(container) {
    const theatres = await getTheatres();
    const tableContainer = document.getElementById("theatresTableContainer");
    tableContainer.innerHTML = "";
    
    if (theatres.length === 0) {
        tableContainer.textContent = "No theatres found.";
        return;
    }

    const headers = ["Theatre #", "Rows", "Seats/Row", "Action"];
    const rows = theatres.map(theatre => {
        const actions = document.createElement("div");
        
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => window.location.hash = `#/admin/edit-theatre?id=${theatre.theatreId}`);
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.marginLeft = "8px";
        deleteButton.addEventListener("click", () => handleDelete(theatre.theatreId, container));
        
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        
        return [
            theatre.theatreNumber,
            theatre.numberOfRows,
            theatre.seatsPerRow,
            actions
        ];
    });

    tableContainer.appendChild(renderTable(headers, rows));
}

async function handleSubmit(event, container) {
    event.preventDefault();
    const theatreData = {
        theatreNumber: document.getElementById("theatreNumber").value,
        numberOfRows: document.getElementById("numberOfRows").value,
        seatsPerRow: document.getElementById("seatsPerRow").value,
        cinemaId: 1
    };

    try {
        await createTheatre(theatreData);
        document.getElementById("message").textContent = "Theatre created!";
        await loadTheatres(container);
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}

async function handleDelete(theatreId, container) {
    if (confirm("Delete theatre?")) {
        try {
            await deleteTheatre(theatreId);
            await loadTheatres(container);
        } catch (err) {
            document.getElementById("message").textContent = "Error: " + err.message;
        }
    }
}

export default { render };
