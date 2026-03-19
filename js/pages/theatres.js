import {getTheatres, createTheatre, deleteTheatre} from "../services/theatresService.js";

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
        <div id="theatresContainer"></div>
    `;

    document.getElementById("theatreForm").addEventListener("submit", (e) => handleSubmit(e, container));
    await loadTheatres(container);
}

async function loadTheatres(container) {
    const theatres = await getTheatres();
    const theatresContainer = document.getElementById("theatresContainer");
    theatresContainer.innerHTML = "";
    
    theatres.forEach(theatre => {
        const theatreDiv = document.createElement("div");
        theatreDiv.classList.add("theatre-card"); // using card class for better look
        theatreDiv.innerHTML = `
            <h3>Theatre ${theatre.theatreNumber}</h3>
            <p>Number of rows: ${theatre.numberOfRows}</p>
            <p>Seats per row: ${theatre.seatsPerRow}</p>
        `;
        
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
        theatreDiv.appendChild(actions);
        theatresContainer.appendChild(theatreDiv);
    });
}

async function handleSubmit(event, container) {
    event.preventDefault();
    const theatreNumber = document.getElementById("theatreNumber").value;
    const numberOfRows = document.getElementById("numberOfRows").value;
    const seatsPerRow = document.getElementById("seatsPerRow").value;

    try {
        await createTheatre({theatreNumber, numberOfRows, seatsPerRow, cinemaId: 1});
        const message = document.getElementById("message");
        message.textContent = "Theatre created!";
        message.style.color = "green";
        await loadTheatres(container);
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
    }
}

async function handleDelete(theatreId, container) {
    if (confirm("Are you sure you want to delete this theatre?")) {
        try {
            await deleteTheatre(theatreId);
            await loadTheatres(container);
        } catch (err) {
            const message = document.getElementById("message");
            message.textContent = "Error: " + err.message;
            message.style.color = "red";
        }
    }
}

export default { render };
