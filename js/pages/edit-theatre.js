import {getTheatreById, updateTheatre} from "../services/theatresService.js";

async function render(container, params) {
    const theatreId = params.get("id");
    const theatre = await getTheatreById(theatreId);

    if (!theatre) {
        container.innerHTML = "<h2>Theatre not found</h2>";
        return;
    }

    container.innerHTML = `
        <a href="#/admin/theatres">← Back to Theatres</a>
        <h2>Edit Theatre</h2>
        <form id="editTheatreForm">
            <label for="theatreNumber">Theatre Number:</label>
            <input type="number" id="theatreNumber" value="${theatre.theatreNumber}" min="1" required>
            <label for="numberOfRows">Number of Rows:</label>
            <input type="number" id="numberOfRows" value="${theatre.numberOfRows}" min="1" required>
            <label for="seatsPerRow">Seats Per Row:</label>
            <input type="number" id="seatsPerRow" value="${theatre.seatsPerRow}" min="1" required>
            <button type="submit">Save Changes</button>
        </form>
        <div id="message"></div>
    `;

    document.getElementById("editTheatreForm").addEventListener("submit", (e) => handleSubmit(e, theatreId));
}

async function handleSubmit(event, theatreId) {
    event.preventDefault();
    const theatreNumber = document.getElementById("theatreNumber").value;
    const numberOfRows = document.getElementById("numberOfRows").value;
    const seatsPerRow = document.getElementById("seatsPerRow").value;

    try {
        await updateTheatre(theatreId, {theatreNumber, numberOfRows, seatsPerRow});
        window.location.hash = "#/admin/theatres";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}

export default { render };
